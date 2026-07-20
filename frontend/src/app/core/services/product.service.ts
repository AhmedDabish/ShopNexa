import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductFilter, PaginatedResult, Category, Review, CreateProductDto, CreateReviewDto } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/api`;
  private http = inject(HttpClient);

  // GET /api/Products — backend returns array, we wrap into PaginatedResult.
  // Applies category / price / rating filters, sort, and pagination client-side.
  getProducts(filter?: ProductFilter): Observable<PaginatedResult<Product>> {
    return this.http.get<any[]>(`${this.API}/Products`).pipe(
      map(data => {
        const arr = Array.isArray(data) ? data : [];
        const allProducts: Product[] = arr.map(p => this.mapProduct(p));
        return this.applyFilterAndPaginate(allProducts, filter);
      })
    );
  }

  // GET /api/Products/{id}
  getProduct(id: number): Observable<Product> {
    return this.http.get<any>(`${this.API}/Products/${id}`).pipe(
      map(p => this.mapProduct(p))
    );
  }

  getByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<any[]>(`${this.API}/Products`).pipe(
      map(arr => arr
        .filter(p => p.categoryId === categoryId)
        .map(p => this.mapProduct(p))
      )
    );
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.API}/Products`).pipe(
      map(arr => arr.slice(0, 8).map(p => this.mapProduct(p)))
    );
  }

  search(q: string, filter?: ProductFilter): Observable<PaginatedResult<Product>> {
    return this.http.get<any[]>(`${this.API}/Products`).pipe(
      map(data => {
        const arr = Array.isArray(data) ? data : [];
        const all = arr.map(p => this.mapProduct(p));
        const term = (q ?? '').toLowerCase().trim();
        // Match against name OR description; if the term is empty we keep everything.
        const matched = term
          ? all.filter(p =>
              p.name.toLowerCase().includes(term) ||
              (p.description?.toLowerCase().includes(term) ?? false)
            )
          : all;
        // Then apply the same category/price/rating/sort/pagination pipeline.
        return this.applyFilterAndPaginate(matched, filter);
      })
    );
  }

  // ─── filter + sort + paginate, shared by getProducts() and search() ───────
  // Important: every filter the UI exposes (category, price range, min rating,
  // sort dropdown, pagination) is honored here. Previously only categoryId was
  // applied, so the price/rating/sort controls did nothing.
  private applyFilterAndPaginate(
    products: Product[],
    filter?: ProductFilter
  ): PaginatedResult<Product> {
    let list = products;

    // Category
    if (filter?.categoryId != null) {
      list = list.filter(p => p.categoryId === filter.categoryId);
    }

    // Price range — compare against the effective price (discountPrice if set,
    // otherwise the regular price). That matches what the customer sees on the card.
    if (filter?.minPrice != null && !isNaN(filter.minPrice)) {
      list = list.filter(p => this.effectivePrice(p) >= filter.minPrice!);
    }
    if (filter?.maxPrice != null && !isNaN(filter.maxPrice)) {
      list = list.filter(p => this.effectivePrice(p) <= filter.maxPrice!);
    }

    // Minimum rating
    if (filter?.rating != null && !isNaN(filter.rating)) {
      list = list.filter(p => (p.averageRating ?? 0) >= filter.rating!);
    }

    // Sort
    list = this.sortProducts(list, filter?.sort);

    // Pagination — done last so totals reflect the filtered set.
    const page = filter?.page ?? 1;
    const limit = filter?.limit ?? 12;
    const totalItems = list.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const start = (page - 1) * limit;
    const items = list.slice(start, start + limit);

    return { items, totalItems, totalPages, currentPage: page };
  }

  // Sort keys match the values in SortComponent's <select>.
  private sortProducts(list: Product[], sort?: string): Product[] {
    if (!sort) return list;
    const copy = [...list]; // don't mutate the input
    switch (sort) {
      case 'price-asc':
        return copy.sort((a, b) => this.effectivePrice(a) - this.effectivePrice(b));
      case 'price-desc':
        return copy.sort((a, b) => this.effectivePrice(b) - this.effectivePrice(a));
      case 'rating-desc':
        return copy.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
      case 'newest':
        return copy.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
      default:
        return list;
    }
  }

  private effectivePrice(p: Product): number {
    // If a discountPrice is set and > 0, that's the price the buyer pays.
    return (p.discountPrice != null && p.discountPrice > 0) ? p.discountPrice : p.price;
  }

  // Map backend DTO → frontend Product model
  private mapProduct(p: any): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      discountPrice: p.discountPrice,
      stockQuantity: p.stockQuantity ?? 0,
      sku: p.sku ?? p.sKU ?? '',
      categoryId: p.categoryId,
      sellerId: p.sellerId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      isActive: p.isActive ?? true,
      viewCount: p.viewCount ?? 0,
      averageRating: p.averageRating ?? 0,
      category: p.categoryName
        ? { id: p.categoryId, name: p.categoryName, description: '', isActive: true }
        : p.category,
      // Handle both: images[] of objects  OR  imageUrls[] of strings
      images: p.images?.length
        ? p.images
        : (p.imageUrls ?? []).map((url: string, i: number) => ({
            id: i,
            productId: p.id,
            imageUrl: url,
            isPrimary: i === 0,
            displayOrder: i
          }))
    };
  }

  // POST /api/Products
  createProduct(data: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.API}/Products`, data);
  }

  // PUT /api/Products/{id}
  updateProduct(id: number, data: any): Observable<Product> {
    return this.http.put<Product>(`${this.API}/Products/${id}`, data);
  }

  // DELETE /api/Products/{id}
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API}/Products/${id}`);
  }

  uploadImages(productId: number, images: FormData): Observable<any> {
    return this.http.post(`${this.API}/Products/${productId}/images`, images);
  }

  deleteImage(imageId: number): Observable<any> {
    return this.http.delete(`${this.API}/Products/images/${imageId}`);
  }

  // GET /api/Reviews/product/{productId}
  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.API}/Reviews/product/${productId}`);
  }

  // POST /api/Reviews
  addReview(review: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(`${this.API}/Reviews`, review);
  }

  // DELETE /api/Reviews/{id}
  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.API}/Reviews/${id}`);
  }

  // GET /api/Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API}/Categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API}/Categories/${id}`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API}/Categories`, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.API}/Categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.API}/Categories/${id}`);
  }
}
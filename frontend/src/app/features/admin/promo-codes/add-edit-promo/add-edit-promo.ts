import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-add-edit-promo', standalone: true, imports: [RouterLink], template: `<a routerLink="/admin/promo-codes">← Back to coupons list</a>` })
export class AddEditPromoComponent {}

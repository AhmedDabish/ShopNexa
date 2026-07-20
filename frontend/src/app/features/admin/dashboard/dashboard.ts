// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { AdminService } from '../../../core/services/admin.service';
// import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
// import { BaseChartDirective } from 'ng2-charts';
// import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

// // تسجيل جميع مكونات Chart.js (بما في ذلك المقاييس)
// Chart.register(...registerables);

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterLink, CurrencyFormatPipe, BaseChartDirective],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css'
// })
// export class AdminDashboardComponent implements OnInit {
//   private adminSvc = inject(AdminService);
//   stats: any = null;
//   loading = true;
//   averageOrderValue = 0;

//   public barChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       tooltip: { callbacks: { label: (tooltipItem) => `$${tooltipItem.raw}` } }
//     },
//     scales: {
//       y: { 
//         beginAtZero: true,
//         title: { display: true, text: 'Sales ($)' },
//         ticks: { callback: (value) => '$' + value }
//       }
//     }
//   };
//   public barChartType: ChartType = 'bar';
//   public barChartData: ChartData<'bar'> = {
//     labels: [],
//     datasets: [{ data: [], label: 'Monthly Sales', backgroundColor: '#3b82f6', borderRadius: 8 }]
//   };

//   ngOnInit(): void {
//     // جلب الإحصائيات الأساسية
//     this.adminSvc.getDashboard().subscribe({
//       next: (s) => {
//         this.stats = s;
//         if (this.stats.totalOrders > 0 && this.stats.totalRevenue > 0) {
//           this.averageOrderValue = this.stats.totalRevenue / this.stats.totalOrders;
//         }
//         this.loading = false;
//       },
//       error: () => { this.loading = false; }
//     });

//     // جلب بيانات المبيعات الشهرية (بيانات تجريبية حالياً)
//     this.adminSvc.getMonthlySales(6).subscribe({
//       next: (data) => {
//         if (data && data.length) {
//           this.barChartData.labels = data.map(d => d.month);
//           this.barChartData.datasets[0].data = data.map(d => d.sales);
//         } else {
//           this.setMockChartData();
//         }
//       },
//       error: () => {
//         console.warn('Could not load monthly sales, using mock data');
//         this.setMockChartData();
//       }
//     });
//   }

//   private setMockChartData(): void {
//     this.barChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
//     this.barChartData.datasets[0].data = [1250, 2300, 1870, 3200, 4100, 2950];
//   }
// }

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private adminSvc = inject(AdminService);
  stats: any = null;
  loading = true;
  averageOrderValue = 0;

  // الرسم البياني الخطي (Revenue + Orders)
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Revenue ($)', borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, yAxisID: 'y' },
      { data: [], label: 'Orders', borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, yAxisID: 'y1' }
    ]
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { title: { display: true, text: 'Revenue ($)' }, beginAtZero: true, ticks: { callback: (val) => '$' + val } },
      y1: { position: 'right', title: { display: true, text: 'Orders' }, beginAtZero: true, grid: { drawOnChartArea: false } }
    }
  };
  public lineChartType: ChartType = 'line';

  // الرسم البياني الدائري
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }]
  };
  public pieChartOptions: ChartConfiguration['options'] = { responsive: true, plugins: { legend: { position: 'right' } } };
  public pieChartType: ChartType = 'pie';

  // أفضل المنتجات
  topProducts: any[] = [];

  ngOnInit(): void {
    // الإحصائيات الأساسية
    this.adminSvc.getDashboard().subscribe({
      next: (s) => {
        this.stats = s;
        if (this.stats.totalOrders > 0 && this.stats.totalRevenue > 0)
          this.averageOrderValue = this.stats.totalRevenue / this.stats.totalOrders;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    // بيانات الرسم الخطي
    this.adminSvc.getMonthlySalesStats(6).subscribe({
      next: (data) => {
        if (data?.length) {
          this.lineChartData.labels = data.map(d => d.month);
          this.lineChartData.datasets[0].data = data.map(d => d.revenue);
          this.lineChartData.datasets[1].data = data.map(d => d.ordersCount);
        }
      }
    });

    // بيانات الرسم الدائري
    this.adminSvc.getOrderStatusStats().subscribe({
      next: (data) => {
        if (data?.length) {
          this.pieChartData.labels = data.map(d => d.status);
          this.pieChartData.datasets[0].data = data.map(d => d.count);
        }
      }
    });

    // أفضل المنتجات
    this.adminSvc.getTopProducts(5).subscribe({
      next: (data) => { this.topProducts = data; }
    });
  }
}
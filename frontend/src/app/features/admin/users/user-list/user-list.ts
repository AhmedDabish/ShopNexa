import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User } from '../../../../core/models/user.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-user-list', standalone: true, imports: [CommonModule, RouterLink, DateFormatPipe], templateUrl: './user-list.html', styleUrl: './user-list.css' })
export class UserListComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private notify = inject(NotificationService);
  users: User[] = [];
  loading = true;

  ngOnInit(): void { this.adminSvc.getUsers().subscribe({ next: u => { this.users = u; this.loading = false; }, error: () => { this.loading = false; } }); }

  approve(id: number): void { this.adminSvc.approveUser(id).subscribe({ next: () => { const u = this.users.find(x => x.id === id); if (u) u.isActive = true; this.notify.success('User activated'); } }); }
  restrict(id: number): void { this.adminSvc.restrictUser(id).subscribe({ next: () => { const u = this.users.find(x => x.id === id); if (u) u.isActive = false; this.notify.warning('User restricted'); } }); }
}

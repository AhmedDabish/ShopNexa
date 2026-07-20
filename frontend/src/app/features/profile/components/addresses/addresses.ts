import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Address } from '../../../../core/models/user.model';

@Component({ selector: 'app-addresses', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './addresses.html', styleUrl: './addresses.css' })
export class AddressesComponent implements OnInit {
  private userSvc = inject(UserService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  addresses: Address[] = [];
  loading = true;
  showForm = false;
  editId: number | null = null;
  saving = false;

  form = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['Egypt', Validators.required],
    isDefault: [false]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.userSvc.getAddresses().subscribe({ next: (a) => { this.addresses = a; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openAdd(): void { this.editId = null; this.form.reset({ country: 'Egypt', isDefault: false }); this.showForm = true; }

  openEdit(a: Address): void {
    this.editId = a.id;
    this.form.patchValue({ street: a.street, city: a.city, state: a.state, zipCode: a.zipCode, country: a.country, isDefault: a.isDefault });
    this.showForm = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = this.editId
      ? this.userSvc.updateAddress(this.editId, this.form.value as any)
      : this.userSvc.addAddress(this.form.value as any);
    req.subscribe({ next: () => { this.showForm = false; this.saving = false; this.notify.success('Address saved'); this.load(); }, error: () => { this.saving = false; } });
  }

  delete(id: number): void {
    if (!confirm('Do you want to delete this address?')) return;
    this.userSvc.deleteAddress(id).subscribe({ next: () => { this.addresses = this.addresses.filter(a => a.id !== id); this.notify.success('Address deleted'); } });
  }
}

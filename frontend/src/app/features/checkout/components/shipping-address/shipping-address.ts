import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { Address } from '../../../../core/models/user.model';

@Component({ selector: 'app-shipping-address', standalone: true, imports: [CommonModule, ReactiveFormsModule, FormsModule], templateUrl: './shipping-address.html', styleUrl: './shipping-address.css' })
export class ShippingAddressComponent implements OnInit {
  @Output() addressSelected = new EventEmitter<number>();
  private userSvc = inject(UserService);
  private fb = inject(FormBuilder);
  addresses: Address[] = [];
  selected: number | null = null;
  showForm = false;
  loading = false;
  form = this.fb.group({ street: ['', Validators.required], city: ['', Validators.required], state: ['', Validators.required], zipCode: ['', Validators.required], country: ['Egypt', Validators.required] });

  ngOnInit(): void { this.userSvc.getAddresses().subscribe(a => { this.addresses = a; const def = a.find(x=>x.isDefault); if (def) this.selected = def.id; }); }

  saveAndSelect(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.userSvc.addAddress(this.form.value as any).subscribe({ next: (a) => { this.addresses.push(a); this.selected = a.id; this.showForm = false; this.loading = false; }, error: () => { this.loading = false; } });
  }

  proceed(): void { if (this.selected) this.addressSelected.emit(this.selected); }
}

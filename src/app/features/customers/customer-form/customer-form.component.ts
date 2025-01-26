import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from "../../../shared/components/popup/popup.component";
import { PopupService } from '../../utils/popup.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isDniReadOnly: boolean = false;
  isEditMode: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
        private popupService: PopupService
    
  ) {
    this.initiateForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const dni = params.get('dni');
      if (dni) {
        this.loadCustomer(dni);
        this.isEditMode = true; // Modo edición si hay DNI
      }
    });
  }

  initiateForm() {
    this.customerForm = this.fb.group({
      dni: [{ value: '', disabled: this.isDniReadOnly }, [Validators.required, Validators.minLength(8)]],
      nombres: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (!this.customerForm.valid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    if (this.isEditMode) {
      this.updateCustomer();
    } else {
      this.addCustomer();
    }
  }

  addCustomer() {
    this.loading = true;
    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/customers']);
        this.resetForm()
        this.popupService.showModal('El huésped ha sido registrado correctamente.');
      },
      error: (err) => {
        alert('Error al agregar el huésped: ' + err.message);
      },
      complete: () => (this.loading = false)
    });
  }

  updateCustomer() {
    this.loading = true;
    this.customerService.updateCustomer(this.customerForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/customers']);
        this.resetForm();
        this.popupService.showModal('El huésped ha sido actualizado correctamente.');
      },
      error: (err) => {
        alert('Error al actualizar el huésped: ' + err.message);
      },
      complete: () => (this.loading = false)
    });
  }

  loadCustomer(dni: string) {
    if (!dni) return;

    this.customerService.getCustomer(dni).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
        this.isDniReadOnly = true;
        this.customerForm.controls['dni'].disable();
      },
      error: (err) => {
        alert('Error al cargar el huésped: ' + err.message);
      }
    });
  }

  resetForm() {
    this.customerForm.reset();
    this.isDniReadOnly = false;
    this.isEditMode = false;
    this.customerForm.controls['dni'].enable();
  }

  cancel() {
    this.router.navigate(['/customers']); 
  }

  get dni() {
    return this.customerForm.controls['dni'];
  }

  get nombres() {
    return this.customerForm.controls['nombres'];
  }

  get telefono() {
    return this.customerForm.controls['telefono'];
  }

  get correo() {
    return this.customerForm.controls['correo'];
  }
}

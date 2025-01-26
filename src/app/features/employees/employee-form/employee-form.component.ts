import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../utils/popup.service';
import { PopupComponent } from "../../../shared/components/popup/popup.component";

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isDniReadOnly: boolean = false; 
  isEditMode: boolean = false; 
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.route.paramMap.subscribe(params => {
      const dni = params.get('dni');
      if (dni) {
        this.loadEmployee(dni);
        this.isEditMode = true; 
      }
    });
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      dni: [{ value: '', disabled: false }, [Validators.required]],
      nombres: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      alert('Por favor, corrija los errores en el formulario.');
      return;
    }

    this.loading = true;
    const employeeData: Employee = this.employeeForm.getRawValue();

    if (this.isEditMode) {
      this.updateEmpleado(employeeData);
    } else {
      this.addEmpleado(employeeData);
    }
  }

  addEmpleado(employee: Employee): void {
    this.employeeService.createEmpleado(employee).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
        this.resetForm();
        this.popupService.showModal('El empleado ha sido registrado correctamente.');
      },
      error: err => alert('Error al agregar el empleado: ' + err),
      complete: () => (this.loading = false),
    });
  }

  updateEmpleado(employee: Employee): void {
    this.employeeService.updateEmpleado(employee).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
        this.resetForm();
        this.popupService.showModal('El empleado ha sido actualizado correctamente.');
      },
      error: err => alert('Error al actualizar el empleado: ' + err),
      complete: () => (this.loading = false),
    });
  }

  loadEmployee(dni: string): void {
    this.employeeService.getEmpleado(dni).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue(employee);
        this.isDniReadOnly = true;
        this.employeeForm.get('dni')?.disable();
      },
      error: err => alert('Error al cargar el empleado: ' + err),
    });
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.isDniReadOnly = false;
    this.isEditMode = false;
    this.employeeForm.get('dni')?.enable();
  }

  cancel() {
    this.router.navigate(['/employees']); 
  }

  get dni() {
    return this.employeeForm.controls['dni'];
  }

  get nombres() {
    return this.employeeForm.controls['nombres'];
  }

  get telefono() {
    return this.employeeForm.controls['telefono'];
  }

  get correo() {
    return this.employeeForm.controls['correo'];
  }
}

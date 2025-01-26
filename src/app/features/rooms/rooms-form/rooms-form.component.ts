import { Component, OnInit } from '@angular/core';
import { Room } from '../../../core/models/room';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from "../../../shared/components/popup/popup.component";
import { PopupService } from '../../utils/popup.service';

@Component({
  selector: 'app-rooms-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PopupComponent],
  templateUrl: './rooms-form.component.html',
  styleUrl: './rooms-form.component.css'
})
export class RoomsFormComponent implements OnInit {
  roomForm!: FormGroup;
  isEditMode: boolean = false; 
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.initiateForm();
    this.route.paramMap.subscribe(params => {
      const codigo = params.get('codigo');
      if (codigo) {
        this.loadRoom(codigo);
        this.isEditMode = true;
      }
    });
  }

  initiateForm() {
    this.roomForm = this.fb.group({
      codigo: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      tipoHabitacion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (!this.roomForm.valid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.isEditMode ? this.updateRoom() : this.addRoom();
  }

  addRoom() {
    this.loading = true;
    this.roomService.createRoom(this.roomForm.value).subscribe({
      next: () => {
        this.router.navigate(['/rooms']);
        this.resetForm()
        this.popupService.showModal('La habitación ha sido registrada correctamente.');
      },
      error: (err) => {
        alert('Error al agregar la habitación: ' + err.message);
      },
      complete: () => (this.loading = false)
    });
  }

  updateRoom() {
    this.loading = true;
    this.roomService.update(this.roomForm.value).subscribe({
      next: () => {
        this.router.navigate(['/habitaciones']);
        this.resetForm()
        this.popupService.showModal('La habitación ha sido registrada correctamente.');
      },
      error: (err) => {
        alert('Error al actualizar la habitación: ' + err.message);
      },
      complete: () => (this.loading = false)
    });
  }

  loadRoom(codigo: string) {
    if (!codigo) return;

    this.roomService.findByCodigo(codigo).subscribe({
      next: (room) => {
        this.roomForm.patchValue(room);
        this.roomForm.controls['codigo'].disable(); 
      },
      error: (err) => {
        alert('Error al cargar la habitación: ' + err.message);
      }
    });
  }

  resetForm() {
    this.roomForm.reset();
    this.isEditMode = false;
  }

  cancel() {
    this.router.navigate(['/rooms']);
  }

  get codigo() {
    return this.roomForm.controls['codigo'];
  }

  get descripcion() {
    return this.roomForm.controls['descripcion'];
  }

  get estado() {
    return this.roomForm.controls['estado'];
  }

  get capacidad() {
    return this.roomForm.controls['capacidad'];
  }

  get tipoHabitacion() {
    return this.roomForm.controls['tipoHabitacion'];
  }

  get precio() {
    return this.roomForm.controls['precio'];
  }
}
import { Component, OnInit } from '@angular/core';
import { Booking } from '../../../core/models/booking';
import { BookingService } from '../../../core/services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomSelectorComponent } from '../room-selector/room-selector.component';
import { CustomerService } from '../../../core/services/customer.service';
import { PopupService } from '../../utils/popup.service';
import { PopupComponent } from "../../../shared/components/popup/popup.component";
declare var bootstrap: any;

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RoomSelectorComponent, PopupComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  newBooking: Booking = {
    codigo: '',
    fechaEntrada: '',
    fechaSalida: '',
    dniHuesped: '',
    usuario: 'rlopez',
    habitaciones: [],
    pago: ''
  };
  isEditMode: boolean = false;
  codes: string[] = [];
  guestName: string = '';
  isGuestFound: boolean = false;

  bookingForm!: FormGroup;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private popupService: PopupService
  ) {
    this.initiateForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const codigo = params.get('codigo');
      if (codigo) {
        this.loadBooking(codigo);
        this.isEditMode = true; 
      }
    });

    const today = new Date().toLocaleDateString('en-CA')
    console.log('Fecha: ', today)
    this.fechaEntrada.setValue(today);
  }

  loadBooking(codigo: string): void {
    if (codigo) {
      this.bookingService.buscarReserva(codigo).subscribe({
        next: (booking) => {
          this.newBooking = booking;
          this.codes = booking.habitaciones;
          this.isEditMode = true;
        },
        error: (error) => {
          console.error('Error al cargar la reserva:', error);
        },
        complete: () => {
          console.log('Carga de la reserva completada.');
        }
      });
    }
  }

  initiateForm() {
    this.bookingForm = this.fb.group( {
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]],
      dniHuesped: ['', [Validators.required]],
      habitaciones: ['', [Validators.required]], // Se inicializa vacío
      pago: ['', [Validators.required]]
    },
    { validators: this.fechaValida() } 
  );
    this.bookingForm.reset();
  }

  searchGuest(): void {
    const dni = this.bookingForm.get('dniHuesped')?.value;

    if (!dni) {
      alert('Por favor ingresa un DNI válido.');
      return;
    }

    this.customerService.getCustomer(dni).subscribe({
      next: (guest) => {
        this.guestName = guest.nombres;
        this.isGuestFound = true;
      },
      error: (error) => {
        console.warn('No se encontró al huésped. Se permitirá registrar uno nuevo.');
        this.isGuestFound = false;
        this.guestName = '';
      },
      complete: () => {
        console.log('Búsqueda de huésped completada.');
      }
    });
  }

  onSubmit() {
    if (this.bookingForm.invalid) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (!this.isEditMode) {
      this.addBooking();
    }
  }

  addBooking() {
    const bookingData = this.bookingForm.value;
    this.newBooking = {
      ...this.newBooking,
      fechaEntrada: bookingData.fechaEntrada,
      fechaSalida: bookingData.fechaSalida,
      dniHuesped: bookingData.dniHuesped,
      habitaciones: this.codes, //
      pago: bookingData.pago
    };

    this.bookingService.createReserva(this.newBooking).subscribe({
      next: () => {
        this.popupService.showModal('La reserva ha sido registrada correctamente.');
        this.router.navigate(['/bookings']);
        this.bookingForm.reset()
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        alert('Hubo un error al crear la reserva. Intenta nuevamente.');
      }
    });
  }

  openRoomSelector() {
    const modalElement = document.getElementById('roomSelectorModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  addRoom(room: any) {
    if (!this.codes.includes(room.codigo)) {
      this.codes.push(room.codigo);
      this.bookingForm.controls['habitaciones'].setValue(this.codes.join(', '));
    }
  }

  cancel() {
    this.router.navigate(['/bookings']);
  }

  get fechaEntrada() {
    return this.bookingForm.controls['fechaEntrada'];
  }
  
  get fechaSalida() {
    return this.bookingForm.controls['fechaSalida'];
  }
  
  get dniHuesped() {
    return this.bookingForm.controls['dniHuesped'];
  }
  
  get habitaciones() {
    return this.bookingForm.controls['habitaciones'];
  }
  
  get pago() {
    return this.bookingForm.controls['pago'];
  }
  
  fechaValida(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaEntrada = control.get('fechaEntrada')?.value;
      const fechaSalida = control.get('fechaSalida')?.value;

      if (fechaEntrada && fechaSalida && new Date(fechaSalida) <= new Date(fechaEntrada)) {
        return { 'fechaInvalida': true }; // Error si la fecha de salida es menor o igual a la de entrada
      }
      return null;
    };
  }

  onFechaEntradaChange() {
    const fechaEntrada = this.fechaEntrada.value;
    if (fechaEntrada) {
      // Deshabilita la fecha de salida si la fecha de entrada está vacía
      this.fechaSalida.setValidators([Validators.required, Validators.min(fechaEntrada)]);
    } else {
      this.fechaSalida.setValidators([Validators.required]);
    }
    this.fechaSalida.updateValueAndValidity(); // Actualiza el estado del control
  }
}

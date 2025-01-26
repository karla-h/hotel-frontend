import { Component, OnInit } from '@angular/core';
import { Booking } from '../../../core/models/booking';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../shared/components/popup/popup.component';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];

  newBooking: Booking = { codigo: '', fechaEntrada: '', fechaSalida: '', dniHuesped: '', usuario: '', habitaciones: [], pago: '' };
   bookingForm!: FormGroup;

  constructor(private router: Router, 
    private bookingService: BookingService,
    private fb: FormBuilder) {}

  ngOnInit() {
    this.initiateForm();
    const today = new Date().toLocaleDateString('en-CA')
    console.log('Fecha: ', today)
    this.fechaReserva.setValue(today);
    this.loadBookingsByDate(today);
  }

  updateBooking(codigo: string) {
    this.router.navigate(['/bookings/form', { codigo }]);
  }

  cancelarBooking(codigo: string): void {
    this.bookingService.cancelarReserva(codigo).subscribe({
      next: () => {
        console.log('Reserva cancelada correctamente');
        this.loadBookingsByDate(new Date().toLocaleDateString('en-CA'))
        let pop = new PopupComponent()
        pop.message = 'La reserva ha sido cancelada correctamente'
        pop.showSuccessModal()
      },
      error: (err) => {
        console.error('Error al cancelar la reserva:', err);
        alert('No se pudo cancelar la reserva.');
      },
      complete: () => {
        console.log('Operación completada');
      },
    });
  }

  confirmarBooking(codigo: string): void {
    this.bookingService.confirmarReserva(codigo).subscribe({
      next: () => {
        this.loadBookingsByDate(new Date().toLocaleDateString('en-CA'))
        let pop = new PopupComponent()
        pop.message = 'La reserva ha sido confirmada correctamente'
        pop.showSuccessModal()
      },
      error: (err) => {
        console.error('Error al confirmar la reserva:', err);
        alert('No se pudo confirmar la reserva.');
      },
      complete: () => {
        console.log('Operación completada');
      },
    });
  }

  loadBookingsByDate(fecha: string) {
    this.bookingService.buscarReservaPorFecha(fecha).subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (err) => {
        console.error('Error al cargar las reservas:', err);
      }
    });
  }
  
  onDateChange() {
    const selectedDate = this.fechaReserva.value;
    if (selectedDate) {
      this.loadBookingsByDate(selectedDate); 
    }
  }

  initiateForm() {
      this.bookingForm = this.fb.group({
        fechaReserva: ['', ],
        dniHuesped: ['', ],
      });
      this.bookingForm.reset();
    }

    get fechaReserva() {
      return this.bookingForm.controls['fechaReserva'];
    }

    get dniHuesped() {
      return this.bookingForm.controls['dniHuesped'];
    }
}

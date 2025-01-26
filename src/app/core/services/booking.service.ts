import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpUtilsService } from '../../auth/service/http-utils.service';
import { apiUrl } from '../../enviroment';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = `${apiUrl}reservas`;

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  getAllBookings(): Observable<Booking[]> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Booking[]>(`${this.apiUrl}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }
  createReserva(booking: Booking): Observable<Booking> {
    const headers = this.httpUtils.getHeaders();
    return this.http.post<Booking>(this.apiUrl, booking, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  buscarReserva(codigo: string): Observable<Booking> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Booking>(`${this.apiUrl}/codigo?codigo=${codigo}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  updateStatus(codigo: string, estado: string): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.patch<void>(`${this.apiUrl}/${codigo}/${estado}`, null, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  cancelarReserva(codigo: string): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.put<void>(`${this.apiUrl}/cancelar/${codigo}`,{}, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  confirmarReserva(codigo: string): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.put<void>(`${this.apiUrl}/confirmar/${codigo}`,{}, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  buscarReservaPorFecha(fecha: string): Observable<Booking[]> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Booking[]>(`${this.apiUrl}/${fecha}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  verificarHabitaciones(request:[]): Observable<boolean> {
    const headers = this.httpUtils.getHeaders();
    return this.http.post<boolean>(`${this.apiUrl}/valid`, request, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }
}

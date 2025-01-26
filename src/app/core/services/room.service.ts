import { Injectable } from '@angular/core';
import { apiUrl } from '../../enviroment';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room';
import { catchError, Observable } from 'rxjs';
import { HttpUtilsService } from '../../auth/service/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = `${apiUrl}habitaciones`;

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  createRoom(habitacion: Room): Observable<Room> {
    const headers = this.httpUtils.getHeaders();
    return this.http.post<Room>(this.apiUrl, habitacion, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  findAllRooms(): Observable<Room[]> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Room[]>(this.apiUrl, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  findByFecha(date: Date): Observable<Room[]> {
    const headers = this.httpUtils.getHeaders();
    const formattedDate = date.toISOString().split('T')[0];
    return this.http.get<Room[]>(`${this.apiUrl}/disponible/${formattedDate}`, { headers })
        .pipe(catchError(this.httpUtils.handleError));
}

  findByCodigo(codigo: string): Observable<Room> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Room>(`${this.apiUrl}/${codigo}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  update(habitacion: Room): Observable<Room> {
    const headers = this.httpUtils.getHeaders();
    return this.http.put<Room>(this.apiUrl, habitacion, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  delete(codigo: string): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${codigo}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }
}

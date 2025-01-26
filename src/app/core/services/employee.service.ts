import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { catchError, Observable } from 'rxjs';
import { apiUrl } from '../../enviroment';
import { HttpUtilsService } from '../../auth/service/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${apiUrl}empleados`;

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  createEmpleado(employee: Employee): Observable<void> {
    const headers = this.httpUtils.getHeaders(); 
    return this.http.post<void>(this.apiUrl, employee, { headers })
      .pipe(catchError(this.httpUtils.handleError)); 
  }

  getAllEmpleados(): Observable<Employee[]> {
    const headers = this.httpUtils.getHeaders(); 
    return this.http.get<Employee[]>(this.apiUrl, { headers })
      .pipe(catchError(this.httpUtils.handleError)); 
  }

  getEmpleado(dni: string): Observable<Employee> {
    const headers = this.httpUtils.getHeaders(); 
    return this.http.get<Employee>(`${this.apiUrl}/${dni}`, { headers })
      .pipe(catchError(this.httpUtils.handleError)); 
  }

  updateEmpleado(employee: Employee): Observable<Employee> {
    const headers = this.httpUtils.getHeaders(); 
    return this.http.put<Employee>(this.apiUrl, employee, { headers })
      .pipe(catchError(this.httpUtils.handleError)); 
  }

  deleteEmpleado(dni: string): Observable<void> {
    const headers = this.httpUtils.getHeaders(); 
    return this.http.delete<void>(`${this.apiUrl}/${dni}`, { headers })
      .pipe(catchError(this.httpUtils.handleError)); 
  }
}

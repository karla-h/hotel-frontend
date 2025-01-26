import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { catchError, Observable } from 'rxjs';
import { apiUrl } from '../../enviroment';
import { HttpUtilsService } from '../../auth/service/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${apiUrl}huespedes`;

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  createCustomer(customer: Customer): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.post<void>(this.apiUrl, customer, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  getAllCustomers(): Observable<Customer[]> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Customer[]>(this.apiUrl, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  getCustomer(dni: string): Observable<Customer> {
    const headers = this.httpUtils.getHeaders();
    return this.http.get<Customer>(`${this.apiUrl}/${dni}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    const headers = this.httpUtils.getHeaders();
    return this.http.put<Customer>(this.apiUrl, customer, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

  deleteCustomer(dni: string): Observable<void> {
    const headers = this.httpUtils.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${dni}`, { headers })
      .pipe(catchError(this.httpUtils.handleError));
  }

}

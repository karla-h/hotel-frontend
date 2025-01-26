import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../core/models/customer';
import { CustomerService } from '../../../core/services/customer.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];

  newCustomer: Customer = { dni: '', nombres: '', telefono: '', correo: '' };

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  addCustomer() {
    this.customerService.createCustomer(this.newCustomer).subscribe(() => {
      this.loadCustomers(); // Reload the list after adding
      this.newCustomer = { dni: '', nombres: '', telefono: '', correo: '' }; // Reset the form
    });
  }

  deleteCustomer(dni: string) {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
      this.customerService.deleteCustomer(dni).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

  uptadeCustomer(dni: string) {
    this.router.navigate(['/customers/form', { dni }])
  }
}
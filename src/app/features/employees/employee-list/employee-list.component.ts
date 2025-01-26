import { Component, OnInit } from '@angular/core';
import { Employee } from '../../../core/models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  newEmployee: Employee = { dni: '', nombres: '', telefono: '', correo: '' };

  constructor(private router: Router, private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.employeeService.getAllEmpleados().subscribe(data => {
      this.employees = data;
    });
  }

  addEmpleado() {
    this.employeeService.createEmpleado(this.newEmployee).subscribe(() => {
      this.loadEmpleados(); // Reload the list after adding
      this.newEmployee = { dni: '', nombres: '', telefono: '', correo: '' }; // Reset the form
    });
  }

  deleteEmpleado(dni: string) {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
      this.employeeService.deleteEmpleado(dni).subscribe(() => {
        this.loadEmpleados();
      });
    }
  }

  uptadeEmployee(dni: string) {
    this.router.navigate(['/employees/form', {dni}])
  }
}

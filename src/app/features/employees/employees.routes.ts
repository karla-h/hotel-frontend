import { Routes } from "@angular/router";
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { EmployeeFormComponent } from "./employee-form/employee-form.component";

export const EMPLOYEES_ROUTES: Routes = [
    {
        path: '',
        component: EmployeeListComponent
    },
    {
        path: 'form/:dni',
        component: EmployeeFormComponent
    },
    {
        path: 'form',
        component: EmployeeFormComponent
    },
] 
import { Routes } from "@angular/router";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerFormComponent } from "./customer-form/customer-form.component";

export const CUSTOMERS_ROUTES: Routes = [
    {
        path: '',
        component: CustomerListComponent
    },
    {
        path: 'form/:dni',
        component: CustomerFormComponent
    },
    {
        path: 'form',
        component: CustomerFormComponent
    },
] 
import { Routes } from "@angular/router";
import { BookingListComponent } from "./booking-list/booking-list.component";
import { BookingFormComponent } from "./booking-form/booking-form.component";

export const BOOKINGS_ROUTES: Routes = [
    {
        path: '',
        component: BookingListComponent
    },
    {
        path: 'form',
        component: BookingFormComponent
    }
]
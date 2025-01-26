import { Routes } from "@angular/router";
import { RoomsListComponent } from "./rooms-list/rooms-list.component";
import { RoomsFormComponent } from "./rooms-form/rooms-form.component";

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomsListComponent
    },
    {
        path: 'form/:codigo',
        component: RoomsFormComponent
    },
    {
        path: 'form',
        component: RoomsFormComponent
    }
]
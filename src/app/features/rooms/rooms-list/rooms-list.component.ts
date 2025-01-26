import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { Room } from '../../../core/models/room';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  rooms: Room[] = [];

  newRoom: Room = { codigo: '', descripcion: '', estado: '', capacidad: 0, tipoHabitacion: '', precio: 0 };

  constructor(private router: Router, private roomService: RoomService) {}

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.roomService.findAllRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  addEmpleado() {
    this.roomService.createRoom(this.newRoom).subscribe(() => {
      this.loadEmpleados(); // Reload the list after adding
      this.newRoom = { codigo: '', descripcion: '', estado: '', capacidad: 0, tipoHabitacion: '', precio: 0 }; // Reset the form
    });
  }

  deleteEmpleado(codigo: string) {
    if (confirm('¿Estás seguro de que deseas eliminar?')) {
      this.roomService.delete(codigo).subscribe(() => {
        this.loadEmpleados();
      });
    }
  }

  uptadeRoom(dni: string) {
    this.router.navigate(['/rooms/form', {dni}])
  }
}

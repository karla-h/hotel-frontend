import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { RoomService } from '../../../core/services/room.service';

declare var bootstrap : any

@Component({
  selector: 'app-room-selector',
  standalone: true,
  imports: [],
  templateUrl: './room-selector.component.html',
  styleUrl: './room-selector.component.css'
})
export class RoomSelectorComponent implements OnChanges {
  
  @Input() date!: string; 
  @Output() roomSelected = new EventEmitter<any>(); 
  rooms: any[] = []; 

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date'] && changes['date'].currentValue) {
      this.loadRooms(changes['date'].currentValue);
    }
  }

  loadRooms(date: string): void {
    this.roomService.findByFecha(new Date(date)).subscribe(
      rooms => this.rooms = rooms
    );
    console.log('La fecha es', this.date);
  }

  selectRoom(room: any) {
    this.roomSelected.emit(room); // Emitir habitación seleccionada al padre
  }

  showModal() {
    const modalElement = document.getElementById('roomSelectorModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

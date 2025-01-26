import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  nombre: string = '';
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.nombre = this.authService.getNombre();
  }

  logout(): void {
    this.authService.logout();
  }
}

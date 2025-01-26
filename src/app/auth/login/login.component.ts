import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.initiateForm()
  }


  initiateForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.loginForm.reset();
  }


  login(): void {
    if (!this.loginForm.valid) {
      alert('Verifique algunos datos')
      return;
    }
    this.authService.login(
      this.username?.value,
      this.password?.value)
      .subscribe({
        next: () => this.router.navigate(['/bookings']),
        error: (err) => alert('Login failed ' + err)
      });

  }

  get username() {
    return this.loginForm.controls['username'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}

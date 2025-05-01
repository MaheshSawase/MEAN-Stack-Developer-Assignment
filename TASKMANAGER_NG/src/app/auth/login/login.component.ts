import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // onSubmit() {
  //   console.log('Form Submitted'); // ✅ Add this
  //   if (this.loginForm.invalid) return;

  //   const { email, password } = this.loginForm.value;
  //   console.log('Email:', email, 'Password:', password); // ✅ Debug check

  //   if (email === 'admin@gmail.com' && password === '1234') {
  //     localStorage.setItem('token', 'dummy-jwt-token');
  //     this.router.navigate(['/dashboard']);
  //   } else {
  //     this.errorMsg = 'Invalid email or password';
  //   }
  // }
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (res) => {
          console.log('Login response:', res);
          if (res.status && res.auth_token) {
            localStorage.setItem('auth_token', res.auth_token); // Store token
            alert(res.message);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']); // Redirect to dashboard
          } else {
            this.errorMsg = 'Login failed: Invalid response from server';
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMsg = error.error?.message || 'Login failed, please try again!';
        }
      );
    }
  }
  


}

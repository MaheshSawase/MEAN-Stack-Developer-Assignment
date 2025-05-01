import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    uName: ['', Validators.required],
    mobile: ['', Validators.required,],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    address: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,private service:AuthService) {}

  onSubmit() {
    if (this.registerForm.valid) {  
      this.service.register(this.registerForm.value).subscribe(
        (res) => {
          console.log('Register response:', res);
          alert(res.message); 
          this.registerForm.reset();
        },
        (error) => 
          {
          console.error('Registration failed:', error);
          alert(error.message || 'Registration failed, please try again!');
        }
        
      );
    }
  }
  
}

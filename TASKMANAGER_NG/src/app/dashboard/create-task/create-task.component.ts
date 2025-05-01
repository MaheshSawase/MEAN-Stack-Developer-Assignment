import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html'
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;

  constructor( private authservice: AuthService,private fb: FormBuilder, private taskService: TaskService, private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      status: ['Pending', Validators.required],
    });
  }

  ngOnInit(): void {}
  onSubmit() {
    if (this.taskForm.valid) {
      this.authservice.createTask(this.taskForm.value).subscribe({
        next: (res) => {
          console.log('Task created:', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Task creation failed:', err);
          alert('Error creating task');
        }
      });
    }
  }
}

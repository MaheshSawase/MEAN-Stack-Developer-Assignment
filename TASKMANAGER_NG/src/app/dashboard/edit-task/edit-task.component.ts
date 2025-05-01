import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html'
})
export class EditTaskComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: string;

  constructor(
    private route: ActivatedRoute,
    private authservice: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
  
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required]
    });
  
    this.authservice.getTaskById(this.taskId).subscribe({
      next: (res) => {
        const task = res.task || res; // Adjust based on your API response shape
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split('T')[0], // Extract date only if it's ISO
          status: task.status
        });
      },
      error: (err) => {
        console.error('Failed to load task:', err);
        alert('Error loading task');
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask = {
        id: this.taskId,
        ...this.taskForm.value
      };

      this.authservice.updateTask(updatedTask).subscribe({
        next: () => {
          alert('Task updated successfully');
          this.router.navigate(['/dashboard']); // or your task list route
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          alert('Failed to update task');
        }
      });
    }
  }
}

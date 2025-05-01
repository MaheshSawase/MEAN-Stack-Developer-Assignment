import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit   {
  tasks: any[] = [];

  constructor(private authservice:AuthService, private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.getuser();
    this.getTask();
  }

  userData: any = null; 
  getuser() {
    this.authservice.getuser().subscribe(
      (res) => {
        console.log('user response:', res);
        this.userData = res.user; // Store user data
      },
      (error) => {
        console.error('User fetch failed:', error);
        alert(error.message || 'User fetch failed, please try again!');
      }
    );
  }

  taskData:any = null;


  getTask() {
    this.authservice.getTask().subscribe(
      (res) => {
        console.log('task response:', res);
        this.tasks = res.tasks; // Set tasks array directly
      },
      (error) => {
        console.error('task fetch failed:', error);
        alert(error.message || 'Task fetch failed, please try again!');
      }
    );
  }
 
  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.authservice.deleteTask(id).subscribe({
        next: (res) => {
          alert('Task deleted successfully');
          this.getTask(); // Refresh the list after deletion
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          alert('Failed to delete task');
        }
      });
    }
  }

}

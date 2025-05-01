import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  private tasks: any[] = [];

  constructor() {}

  getTasks(): Observable<any[]> {
    return of(this.tasks);
  }

  createTask(task: any): Observable<any> {
    task._id = String(Date.now());
    this.tasks.push(task);
    return of(task);
  }

  getTaskById(id: string): Observable<any | undefined> {
    return of(this.tasks.find(t => t._id === id));
  }

  updateTask(id: string, updatedTask: any): Observable<any> {
    const index = this.tasks.findIndex(t => t._id === id);
    if (index !== -1) {
      this.tasks[index] = { ...updatedTask, _id: id };
      return of(this.tasks[index]);
    }
    return of(undefined as any);
  }

  deleteTask(id: string): Observable<boolean> {
    this.tasks = this.tasks.filter(t => t._id !== id);
    return of(true);
  }
}

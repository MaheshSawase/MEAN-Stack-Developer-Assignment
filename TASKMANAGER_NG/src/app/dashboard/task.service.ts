import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks'; // Change to match your backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth-token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTasks(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, { headers: this.getAuthHeaders() });
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getAuthHeaders() });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}


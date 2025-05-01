import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth-token';
  private apiUrl = 'http://localhost:5000/api/user'; // Update with real backend later

  constructor(private http: HttpClient, private router: Router) {}


  register(userData: any): Observable<any> {
    console.log("data from service",userData);
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getuser(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/get-user`, { headers });
  }

  createTask(taskData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/create-task`, taskData, { headers });
  }

  getTask(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/get-tasks`, { headers });
  }
  
  

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }

  deleteTask(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // GET method use kiya hai DELETE ke jagah
    return this.http.get(`${this.apiUrl}/delete-task/${id}`, { headers });
  }
  
  updateTask(taskData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}/update-task`, taskData, { headers });
  }
  
  getTaskById(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get(`${this.apiUrl}/task/${id}`, { headers });
  }
  
}

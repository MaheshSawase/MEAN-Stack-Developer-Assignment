# MEAN-Stack-Developer-Assignment

This is a Task Manager Web Application built using the MEAN stack – MongoDB, Express.js, Angular, and Node.js.
With this app, users can register, log in, and manage their personal tasks. Each user sees only their own tasks. 

User Registration & Login
New users can sign up
Registered users can log in securely
Passwords are protected using encryption (bcrypt)

 **Task Management**
Users can create, view, edit, and delete their tasks
Each task includes:
Title
Description
Due date
Status (Pending / In Progress / Completed)

 **Security Features**
Uses JWT (JSON Web Token) for secure login
User authentication for protected routes
Tokens are safely stored in the browser (localStorage)

**Modern Frontend with Angular**
Clean and responsive UI using Bootstrap
Forms built using Angular’s Reactive Forms
Angular Services handle API communication
Only logged-in users can access the dashboard (with Route Guards)

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/auth.guard';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { CreateTaskComponent } from './dashboard/create-task/create-task.component';
import { EditTaskComponent } from './dashboard/edit-task/edit-task.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create-task', component: CreateTaskComponent},
  { path: 'edit-task/:id', component: EditTaskComponent},
  { path: 'dashboard',component: DashboardComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

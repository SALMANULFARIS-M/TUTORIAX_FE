import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminTeachersComponent } from './admin-teachers/admin-teachers.component';
import { AdminStudentsComponent } from './admin-students/admin-students.component';



const adminRoute: Routes = [
  {path: 'login', component: AdminLoginComponent},
  {
    path: '', component: AdminComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'teachers', component: AdminTeachersComponent },
      { path: 'students', component: AdminStudentsComponent },
    ]
  },

]

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminCoursesComponent,
    AdminTeachersComponent,
    AdminStudentsComponent,
  ],
  imports: [
    RouterModule.forChild(adminRoute),
    CommonModule,
    HttpClientModule
  ],
  exports: [
    RouterModule
  ]
})
export class AdminModule { }

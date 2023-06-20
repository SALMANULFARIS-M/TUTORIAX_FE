import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { CoursesviewComponent } from './coursesview/coursesview.component';
import { NotfoundComponent } from '../errors/notfound/notfound.component';


const studentRoute: Routes = [
  {
    path: '', component: StudentComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'courses', component: StudentCoursesComponent },
      { path: 'courses/:id', component: CoursesviewComponent },
    ]
  },
  { path: '**', component: NotfoundComponent }]
@NgModule({
  declarations: [
    StudentCoursesComponent,
    CoursesviewComponent
  ],
  imports: [
    RouterModule.forChild(studentRoute),
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    RouterModule
  ]
})
export class StudentModule { }

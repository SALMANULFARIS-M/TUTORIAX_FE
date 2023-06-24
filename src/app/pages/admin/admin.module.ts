import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminCoursesComponent } from './admin-courses/admin-courses.component';
import { AdminTeachersComponent } from './admin-teachers/admin-teachers.component';
import { AdminStudentsComponent } from './admin-students/admin-students.component';
import { CoursepageComponent } from './coursepage/coursepage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminGuardGuard } from 'src/app/guard/admin-guard.guard';


const adminRoute: Routes = [
  { path: 'login', component: AdminLoginComponent },
  {
    path: '',
    component: AdminComponent,canActivate:[AdminGuardGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'courses', component: AdminCoursesComponent },
      { path: 'addcourse', component: CoursepageComponent },
      { path: 'editcourse/:id', component: CoursepageComponent },
      { path: 'viewcourse/:id', component: CoursepageComponent },
      { path: 'teachers', component: AdminTeachersComponent },
      { path: 'students', component: AdminStudentsComponent },
    ]
  }]


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminCoursesComponent,
    AdminTeachersComponent,
    AdminStudentsComponent,
    CoursepageComponent,
  ],
  imports: [
    RouterModule.forChild(adminRoute),
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  exports: [
    RouterModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }

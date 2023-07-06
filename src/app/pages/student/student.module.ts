import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentCoursesComponent } from './student-courses/student-courses.component';
import { CoursesviewComponent } from './coursesview/coursesview.component';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';
import { TutorListComponent } from './tutor-list/tutor-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentGuard } from 'src/app/guard/student.guard';
import { ContactsComponent } from './chat/contacts/contacts.component';

const studentRoute: Routes = [
  {
    path: '', component: StudentComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'courses', component: StudentCoursesComponent },
      { path: 'courses/:id', component: CoursesviewComponent },
      { path: 'chat', component: ChatComponent,canActivate:[StudentGuard] },
      { path: 'instructor', component: TutorListComponent },
    ]
  }]
@NgModule({
  declarations: [
    StudentCoursesComponent,
    CoursesviewComponent,
    ChatComponent,
    TutorListComponent,
    ContactsComponent,
  ],
  imports: [
    RouterModule.forChild(studentRoute),
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    RouterModule
  ],
})
export class StudentModule { }

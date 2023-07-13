import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorRegisterComponent } from './tutor-register/tutor-register.component';
import { TutorLoginComponent } from './tutor-login/tutor-login.component';
import { RouterModule, Routes } from '@angular/router';
import { TutorComponent } from './tutor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeComponent } from './home/home.component';
import { TutorGuard } from 'src/app/guard/tutor.guard';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from './chat/contacts/contacts.component';
import { ProfileComponent } from "../student/profile/profile.component";


const tutorRoute: Routes = [
  { path: 'register', component: TutorRegisterComponent },
  { path: 'login', component: TutorLoginComponent },
  {
    path: '',
    component: TutorComponent,canActivate:[TutorGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'profile', component: ProfileComponent ,canActivate:[TutorGuard]},
    ]
  }
];

@NgModule({
  declarations: [
    TutorRegisterComponent,
    TutorLoginComponent,
    ChatComponent,
    HomeComponent,
    ContactsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(tutorRoute),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  exports: [
    RouterModule
  ],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
})
export class TutorModule { }

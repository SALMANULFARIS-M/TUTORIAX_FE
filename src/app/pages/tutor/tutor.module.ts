import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorRegisterComponent } from './tutor-register/tutor-register.component';
import { TutorLoginComponent } from './tutor-login/tutor-login.component';
import { RouterModule, Routes } from '@angular/router';
import { TutorComponent } from './tutor.component';
import { NotfoundComponent } from '../errors/notfound/notfound.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

const tutorRoute: Routes = [
  { path: 'register', component: TutorRegisterComponent },
  { path: 'login', component: TutorLoginComponent },
  {
    path: '',
    component: TutorComponent,
    children: [

    ]
  }
];

@NgModule({
  declarations: [
    TutorRegisterComponent,
    TutorLoginComponent
  ],
  imports: [
    RouterModule.forChild(tutorRoute),
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  exports: [
    RouterModule
  ],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
})
export class TutorModule { }

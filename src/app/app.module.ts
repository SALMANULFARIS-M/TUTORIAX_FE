import { NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from "ng-particles";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

//import firebase and environment
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { environment } from "../environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './pages/student/student.component';
import { HomeComponent } from './pages/student/home/home.component';
import { RegisterComponent } from './pages/student/register/register.component';
import { LoginComponent } from './pages/student/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgParticlesModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyBuDl_nSTpKOc6a_FzabCvQW2UtqnLuffE",
      authDomain: "e-mail-otp-verification.firebaseapp.com",
      projectId: "e-mail-otp-verification",
      storageBucket: "e-mail-otp-verification.appspot.com",
      messagingSenderId: "481187461752",
      appId: "1:481187461752:web:f8255469cf48b74e5d0b8d",
      measurementId: "G-DGKX0B9QDQ"
    })),//intialize our firebase config from environment
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  ],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

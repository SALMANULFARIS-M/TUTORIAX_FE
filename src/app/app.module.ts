import { CUSTOM_ELEMENTS_SCHEMA, NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgParticlesModule } from "ng-particles";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './core/token.interceptor';


//import firebase and environment
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

import { environment } from "../environments/environment.development";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './pages/student/student.component';
import { HomeComponent } from './pages/student/home/home.component';
import { RegisterComponent } from './pages/student/register/register.component';
import { LoginComponent } from './pages/student/login/login.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NotfoundComponent } from './pages/errors/notfound/notfound.component';
import { InternalserverComponent } from './pages/errors/internalserver/internalserver.component';
import { BadgatewayComponent } from './pages/errors/badgateway/badgateway.component';
import { TutorComponent } from './pages/tutor/tutor.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { BadrequestComponent } from './pages/errors/badrequest/badrequest.component';
import { CommonerrorComponent } from './pages/errors/commonerror/commonerror.component';
const config: SocketIoConfig = { url: environment.socketIO_Endpoint, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    AdminLoginComponent,
    AdminComponent,
    NotfoundComponent,
    InternalserverComponent,
    BadgatewayComponent,
    TutorComponent,
    BadrequestComponent,
    CommonerrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgParticlesModule,
    SocialLoginModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),//intialize our firebase config from environment
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
{
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.clientId),
          },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import { environment } from 'src/environments/environment.development';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  token!: string;

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const isAdminRequest = request.url.includes("admin");
    const isTeacherRequest = request.url.includes("teacher");

    if (isAdminRequest) {
      this.token = "admin";
    } else if (isTeacherRequest) {
      this.token = "tutor";
    } else {
      this.token = "student";
    }

    const authService = this.authService.getToken(this.token);
    const headers: HttpHeaders = authService ? new HttpHeaders({ Authorization: 'Bearer ' + authService }) : new HttpHeaders();
    const newRequest = request.clone({
      url: environment.backendApiUrl + request.url,
      headers: headers.set('Content-Type', 'application/json')
    });
    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        const statusCode = error.status;
        this.authService.handleError(statusCode);
        return throwError(error); // Return an ObservableInput value
      })
    );
  }
}

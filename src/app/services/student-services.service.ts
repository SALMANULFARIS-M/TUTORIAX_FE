import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class StudentServicesService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  //check user
  checkUserExist(userData: any): Observable<any> {
    return this.http.post('checkstudent', userData, httpOptions)
  }

  //check user
  savePassword(userData: any): Observable<any> {
    return this.http.post('savepassword', userData, httpOptions)
  }

  //insert user
  insertUser(userData: any): Observable<any> {
    return this.http.post('register', userData, httpOptions)
  }

  login(userData: any): Observable<any> {
    return this.http.post('login', userData, httpOptions)
  }

  //JWT Token taken from browser cokkiestorage
  getToken(token: string) {
    if (token == "admin") {
      return this.cookieService.get('adminjwt')
    } else if ("intructor") {
      return this.cookieService.get('instructorjwt')
    } else {
      return this.cookieService.get('studentjwt')
    }
  }

  studentLog() {
    return !!this.cookieService.get('studentjwt')
  }

}

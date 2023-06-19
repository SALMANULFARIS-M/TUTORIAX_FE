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

  pay(id:string,userData: any): Observable<any> {
    return this.http.post(`payment/${id}`, userData, httpOptions)
  }

  checkPurchasedCourse(data:any): Observable<any> {
    return this.http.post('checkcourse',data,httpOptions)
  }


  studentLog():boolean {
    return !!this.cookieService.get('studentjwt')
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TutorserviceService {

  constructor(private http: HttpClient) { }
  //check user
  checkTutorExist(userData: any): Observable<any> {
    return this.http.post('tutor/checktutor', userData, httpOptions)
  }

  //insert user
  insertTutor(userData: any): Observable<any> {
    return this.http.post('tutor/register', userData, httpOptions)
  }

  login(userData: any): Observable<any> {
    return this.http.post('tutor/login', userData, httpOptions)
  }
  getAllChats(id: any): Observable<any> {
    return this.http.get(`tutor/getallchats/${id}`, httpOptions)
  }

}

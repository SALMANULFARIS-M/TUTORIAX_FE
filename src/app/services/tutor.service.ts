import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mobile } from "../models/mobile.interface";
import { tutor } from "../models/tutor.interface";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  constructor(private http: HttpClient) { }
  //check user
  checkTutorExist(userData: mobile): Observable<any> {
    return this.http.post('tutor/checktutor', userData, httpOptions)
  }

  //insert user
  insertTutor(userData: tutor): Observable<any> {
    return this.http.post('tutor/register', userData, httpOptions)
  }

  login(userData: tutor): Observable<any> {
    return this.http.post('tutor/login', userData, httpOptions)
  }
  getAllChats(id: string): Observable<any> {
    return this.http.get(`tutor/getallchats/${id}`, httpOptions)
  }

}

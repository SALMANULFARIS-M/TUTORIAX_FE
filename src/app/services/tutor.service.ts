import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mobile } from "../models/mobile.interface";
import { tutor } from "../models/tutor.interface";



@Injectable({
  providedIn: 'root'
})
export class TutorService {

  constructor(private http: HttpClient) { }
  //check user
  checkTutorExist(userData: mobile): Observable<any> {
    return this.http.post('tutor/checktutor', userData)
  }

  //insert user
  insertTutor(userData: tutor): Observable<any> {
    return this.http.post('tutor/register', userData)
  }

  login(userData: tutor): Observable<any> {
    return this.http.post('tutor/login', userData)
  }
  getAllChats(id: string|null): Observable<any> {
    return this.http.get(`tutor/getallchats/${id}`)
  }

  getTeacher(): Observable<any> {
    return this.http.get('tutor/getteacher')
  }
  updateTeacher(data:tutor): Observable<any> {
    return this.http.patch('tutor/editteacher',data)
  }
  updateimage(data:tutor): Observable<any> {
    return this.http.patch('tutor/editimage',data)
  }

}

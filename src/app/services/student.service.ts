import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  //check user
  checkUserExist(userData: any): Observable<any> {
    return this.http.post('checkstudent', userData)
  }

  //check user
  savePassword(userData: any): Observable<any> {
    return this.http.post('savepassword', userData)
  }

  //insert user
  insertUser(userData: any): Observable<any> {
    return this.http.post('register', userData)
  }

  login(userData: any): Observable<any> {
    return this.http.post('login', userData)
  }

  pay(id: string, userData: any): Observable<any> {
    return this.http.post(`payment/${id}`, userData)
  }

  checkPurchasedCourse(data: any): Observable<any> {
    return this.http.post('checkcourse', data)
  }

  getTutors(): Observable<any> {
    return this.http.get('gettutors',)
  }
  chatConnection(data: any): Observable<any> {
    return this.http.post('connection', data)
  }
  getAllChats(id: string): Observable<any> {
    return this.http.get(`getallchats/${id}`)
  }
  getAllMessages(id: string): Observable<any> {
    return this.http.get(`getallmessages/${id}`)
  }
  sendMessage(data: any): Observable<any> {
    return this.http.post('sendmessage', data)
  }
  applyCoupon(data: any): Observable<any> {
    return this.http.post('applycoupon', data)
  }
  reportVideo(data: any): Observable<any> {
    return this.http.post('reportvideo', data)
  }

}

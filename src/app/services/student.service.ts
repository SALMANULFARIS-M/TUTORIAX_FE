import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { student } from "../models/student.interface";
import {PaymentData,paymentCheck} from "../models/payment.interface";
import {connection,message} from "../models/chat.interface";
import { coupon,reportVideo } from "../models/coupon.interface";



@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  //check user
  checkUserExist(userData: student): Observable<any> {
    return this.http.post('checkstudent', userData)
  }

  //check user
  savePassword(userData: student): Observable<any> {
    return this.http.post('savepassword', userData)
  }

  //insert user
  insertUser(userData: student): Observable<any> {
    return this.http.post('register', userData)
  }

  login(userData: student): Observable<any> {
    return this.http.post('login', userData)
  }

  pay(id: string, payData: PaymentData): Observable<any> {
    return this.http.post(`payment/${id}`, payData)
  }

  checkPurchasedCourse(data: paymentCheck): Observable<any> {
    return this.http.post('checkcourse', data)
  }

  getTutors(): Observable<any> {
    return this.http.get('gettutors',)
  }
  chatConnection(data: connection): Observable<any> {
    return this.http.post('connection', data)
  }
  getAllChats(id: string): Observable<any> {
    return this.http.get(`getallchats/${id}`)
  }
  getAllMessages(id: string): Observable<any> {
    return this.http.get(`getallmessages/${id}`)
  }
  sendMessage(data: message): Observable<any> {
    return this.http.post('sendmessage', data)
  }
  applyCoupon(data: coupon): Observable<any> {
    return this.http.post('applycoupon', data)
  }
  reportVideo(data: reportVideo): Observable<any> {
    return this.http.post('reportvideo', data)
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { googleLog, student } from "../models/student.interface";
import { PaymentData, paymentCheck } from "../models/payment.interface";
import { connection, message } from "../models/chat.interface";
import { coupon, reportVideo } from "../models/coupon.interface";


interface chat {
  connection: string;
  to?: string
}

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

  pay(id: string|null, payData: PaymentData): Observable<any> {
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
  getAllChats(id: string|null): Observable<any> {
    return this.http.get(`getallchats/${id}`)
  }
  getAllMessages(data:chat): Observable<any> {
    return this.http.post('getallmessages',data)
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
  chatSeen(data: chat): Observable<any> {
    return this.http.post('chatseen', data)
  }
  chatviewed(id: string): Observable<any> {
    return this.http.patch(`chatview/${id}`,{})
  }
  getStudent(): Observable<any> {
    return this.http.get('getstudent')
  }
  updateStudent(data:student): Observable<any> {
    return this.http.patch('editstudent',data)
  }
  updateimage(data:student): Observable<any> {
    return this.http.patch('editimage',data)
  }
  googleSignIN(data:googleLog): Observable<any> {
    return this.http.post('googlelog',data)
  }

}

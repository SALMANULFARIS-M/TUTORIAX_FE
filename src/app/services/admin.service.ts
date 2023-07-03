import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  login(userData: any): Observable<any> {
    return this.http.post('admin/login', userData)
  }
  addCourse(courseData: any): Observable<any> {
    return this.http.post('admin/addcourse', courseData)
  }
  getAllCourses(): Observable<any> {
    return this.http.get('admin/getallcourses')
  }
  getCourse(id: string): Observable<any> {
    return this.http.get(`admin/getcourse/${id}`)
  }
  editCourse(id: string, data: any): Observable<any> {
    return this.http.patch(`admin/editcourse/${id}`, data)
  }
  deleteCourses(id: string): Observable<any> {
    return this.http.delete(`admin/deletecourse/${id}`)
  }
  getAllstudents(): Observable<any> {
    return this.http.get('admin/getallstudents')
  }
  block(id: string, data: any): Observable<any> {
    return this.http.patch(`admin/blockstudent/${id}`, data)
  }
  getAlltutors(): Observable<any> {
    return this.http.get('admin/getalltutors')
  }
  getTutor(id: string): Observable<any> {
    return this.http.get(`admin/gettutor/${id}`)
  }
  tutorApproval(id: string): Observable<any> {
    return this.http.patch(`admin/approvetutor/${id}`, {})
  }
  tuorBlock(id: string, data: any): Observable<any> {
    return this.http.patch(`admin/blocktutor/${id}`, data)
  }
  getCoupons(): Observable<any> {
    return this.http.get('admin/getcoupons')
  }
  addCoupon(data: any): Observable<any> {
    return this.http.post('admin/addcoupon', data)
  }
  deleteCoupon(id: string): Observable<any> {
    return this.http.delete(`admin/deletecoupon/${id}`)
  }

}

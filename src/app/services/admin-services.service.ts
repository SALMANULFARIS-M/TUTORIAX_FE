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
export class AdminServicesService {

  constructor(private http:HttpClient) { }

  login(userData: any): Observable<any> {
    return this.http.post('admin/login', userData, httpOptions)
  }
  addCourse(courseData: any): Observable<any> {
    return this.http.post('admin/addcourse', courseData, httpOptions)
  }
  getAllCourses(): Observable<any> {
    return this.http.get('admin/getallcourses')
  }
  getCourse(id:string): Observable<any> {
    return this.http.get(`admin/getcourse/${id}`)
  }
  editCourse(id:string,data:any): Observable<any> {
    return this.http.patch(`admin/editcourse/${id}`,data,httpOptions)
  }
  deleteCourses(id:string): Observable<any> {
    return this.http.delete(`admin/deletecourse/${id}`)
  }
  getAllstudents(): Observable<any> {
    return this.http.get('admin/getallstudents')
  }
  block(id:string,data:any): Observable<any> {
    return this.http.patch(`admin/blockstudent/${id}`,data,httpOptions)
  }
}

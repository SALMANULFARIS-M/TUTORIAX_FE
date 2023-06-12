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
}

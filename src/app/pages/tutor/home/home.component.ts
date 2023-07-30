import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  students: any
  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.adminService.getAllstudents().subscribe((res) => {
      this.students = res.data
    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }
}

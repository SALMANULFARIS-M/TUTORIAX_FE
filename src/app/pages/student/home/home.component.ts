import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: any
  tutors: any
  constructor(private adminService: AdminService, private studentService: StudentService, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.adminService.getAllCourses().subscribe((result: any) => {
      if (result.status) {
        this.courses = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
    this.studentService.getTutors().subscribe((result: any) => {
      if (result.status) {
        this.tutors = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  goToDetails(courseId: string): void {
    this.router.navigate(['courses', courseId]);
  }
}

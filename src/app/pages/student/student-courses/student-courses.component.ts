import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import Swal from 'sweetalert2';


const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.scss']
})
export class StudentCoursesComponent implements OnInit {
  courses: any
  constructor(private adminService: AdminServicesService, private router: Router, private authService: AuthserviceService) { }
  ngOnInit(): void {
    this.adminService.getAllCourses().subscribe((result: any) => {
      if (result.status) {
        this.courses = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  goToDetails(courseId: string): void {
    this.router.navigate(['courses', courseId]);
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import { AuthserviceService } from 'src/app/services/authservice.service';



@Component({
  selector: 'app-student-courses',
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.scss']
})
export class StudentCoursesComponent implements OnInit {
  searchQuery: string = '';
  filteredCourses: any;
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
  searchCourses() {
    // Filter the courses array based on the search query
    this.filteredCourses = this.courses.filter((course:any) => {
      // Convert both the course title and description to lowercase for case-insensitive search
      const title = course.title.toLowerCase();
      const description = course.description.toLowerCase();
      const searchQuery = this.searchQuery.toLowerCase();

      // Return true if the course title or description contains the search query
      return title.includes(searchQuery) || description.includes(searchQuery);
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent implements OnInit {

  searchQuery: string = '';
  filteredCourses: any;
  tutors: any;
  constructor(private studentService: StudentService, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.studentService.getTutors().subscribe((result: any) => {
      if (result.status) {
        this.tutors = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  //chat connection creation or navigate to chat with data
  chat(id: string) {
    if (this.authService.isStudentLoggedIn()
    ) {
      const token = localStorage.getItem('studentjwt')
      const data = {
        tutor: id,
        student: token
      }
      this.studentService.chatConnection(data).subscribe((result: any) => {
        if (result.status) {
          this.router.navigate(['/chat'], {
            state: {
              data: result.newConnection
            }
          });
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    } else {
      this.router.navigate(['/login'])
    }
  }

  //search  datas
  searchCourses() {
    // Filter the courses array based on the search query
    this.filteredCourses = this.tutors.filter((tutor: any) => {
      // Convert both the course title and description to lowercase for case-insensitive search
      const title = tutor.fullName.toLowerCase();
      const searchQuery = this.searchQuery.toLowerCase();

      // Return true if the course title or description contains the search query
      return title.includes(searchQuery);
    });
  }

}

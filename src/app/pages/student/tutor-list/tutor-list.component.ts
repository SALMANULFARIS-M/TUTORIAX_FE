import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent implements OnInit {

  tutors: any
  constructor(private studentService: StudentServicesService, private authService: AuthserviceService, private router: Router) { }
  ngOnInit(): void {
    this.studentService.getTutors().subscribe((result: any) => {
      if (result.status) {
        this.tutors = result.data
        console.log(this.tutors);
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  chat(id: string) {
    if (this.authService.isStudentLoggedIn()
    ) {
      this.router.navigate(['/chat'])
    } else {
      this.router.navigate(['/login'])
    }
  }


}

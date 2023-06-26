import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';

@Component({
  selector: 'app-tutor-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent implements OnInit {

  tutors: any
  constructor(private studentService: StudentServicesService, private authService: AuthserviceService, private router: Router,
    private cookieService:CookieService) { }
  ngOnInit(): void {
    this.studentService.getTutors().subscribe((result: any) => {
      if (result.status) {
        this.tutors = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  chat(id: string) {
    if (this.authService.isStudentLoggedIn()
    ) {
      const token = this.cookieService.get('studentjwt')
      const data = {
        tutor: id,
        student: token
      }
      this.studentService.chatConnection(data).subscribe((result: any) => {
        if (result.status) {
          this.router.navigate(['/chat'])
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    } else {
      this.router.navigate(['/login'])
    }
  }

}

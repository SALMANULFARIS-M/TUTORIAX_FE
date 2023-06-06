import { Component,HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { StudentServicesService } from 'src/app/services/student-services.service';
import {
  Dropdown,
  Ripple,
  initTE,
} from "tw-elements";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

constructor(private router: Router,private studentService:StudentServicesService, private cookieService: CookieService){}

//declarations
navbg!: boolean;

ngOnInit(): void {

}

//navbar showing
shouldShowNavbar(): boolean {
  const currentRoute = this.router.url;
  return currentRoute !== '/register' && currentRoute !== '/login';
}


//check the user login or not
isLoggedIn() {
  return  this.studentService.studentLog()
}


//logout
logout() {
  this.cookieService.delete('studentjwt');
  this.router.navigate(['/login'])
}

//when  scrolling navbar colour  change
@HostListener('document:scroll')
scrollover() {
  // console.log(document.body.scrollTop, 'scrolllength#');
  if (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
    this.navbg = true;
  } else {
    this.navbg = false;
  }
}

}

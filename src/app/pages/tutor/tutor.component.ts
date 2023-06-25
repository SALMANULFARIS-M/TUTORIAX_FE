import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent {

navbg:any;
activeClass: string = "text-cyan-400  hover:text-cyan-500 dark:hover:text-cyan-500";
inactiveClass: string = "text-white  hover:text-cyan-500 dark:hover:text-cyan-500";

constructor(private router:Router,private authService:AuthserviceService,private cookieService:CookieService){}

currentRoute(): string {
  return this.router.url;
}
  //check the user login or not
  isLoggedIn() {
    return this.authService.isStudentLoggedIn()
  }

  //logout
  logout() {
    this.cookieService.delete('tutorjwt');
    this.router.navigate(['/tutor/login'])
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

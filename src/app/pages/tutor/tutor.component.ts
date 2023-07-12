import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss']
})
export class TutorComponent {

navbg:any;
activeClass: string = "text-cyan-400  hover:text-cyan-500 dark:hover:text-cyan-500";
inactiveClass: string = "text-white  hover:text-cyan-500 dark:hover:text-cyan-500";

constructor(private router:Router,private authService:AuthService){}

currentRoute(): string {
  return this.router.url;
}
  //check the user login or not
  isLoggedIn() {
    return this.authService.isStudentLoggedIn()
  }

  //logout
  logout() {
    localStorage.removeItem('tutorjwt');
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

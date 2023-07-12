import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})

export class StudentComponent implements OnInit {
[x: string]: any;

  activeClass: string = "text-cyan-400  hover:text-cyan-500 dark:hover:text-cyan-500";
  inactiveClass: string = "text-white  hover:text-cyan-500 dark:hover:text-cyan-500";
  constructor(private router: Router, private authService: AuthService) {
   }

  //declarations
  navbg!: boolean;

  ngOnInit(): void {

    const dropdownToggleButton = document.getElementById('dropdownNavbarLink') as HTMLElement;
    const dropdownMenu = document.getElementById('dropdownNavbar') as HTMLElement;
    dropdownToggleButton.addEventListener('click', function () {
      dropdownMenu.classList.toggle('hidden');
    });

    const toggleButtonElement = document.getElementById('toggleButton') as HTMLElement;
    const navbarElement = document.getElementById('toggleNav') as HTMLElement;
    toggleButtonElement.addEventListener('click', () => {
      const expanded = toggleButtonElement.getAttribute('aria-expanded') === 'true' || false;
      toggleButtonElement.setAttribute('aria-expanded', (!expanded).toString());
      navbarElement.classList.toggle('hidden');
    });
  }

  currentRoute(): string {
    return this.router.url;
  }

  //navbar showing
  shouldShowNavbar(): boolean {
    const currentRoute = this.router.url;
    return currentRoute !== '/register' && currentRoute !== '/login';
  }

  //check the user login or not
  isLoggedIn() {
    return this.authService.isStudentLoggedIn()
  }

  //logout
  logout() {
    localStorage.removeItem('studentjwt');
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

import { HtmlParser } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(private router: Router) {
  }

  activeClass: string = "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100";
  inactiveClass: string = "border-gray-900 text-gray-400 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100";

  ngOnInit(): void {
    // JavaScript to handle sidebar toggle

  }

  sidebarHandler(flag: boolean) {
    const sideBar = document.getElementById("mobile-nav") as HTMLElement;
    const openSidebar = document.getElementById("openSideBar") as HTMLElement;
    const closeSidebar = document.getElementById("closeSideBar") as HTMLElement;
    sideBar.style.transform = "translateX(-260px)";

    if (flag) {
      sideBar.style.transform = "translateX(0px)";
      openSidebar.classList.add("hidden");
      closeSidebar.classList.remove("hidden");
    } else {
      sideBar.style.transform = "translateX(-260px)";
      closeSidebar.classList.add("hidden");
      openSidebar.classList.remove("hidden");
    }
  }



  //navbar showing
  shouldShowNavbar(): boolean {
    const currentRoute = this.router.url;
    return currentRoute !== '/admin';
  }
  currentRoute(): string {
    return this.router.url;
  }

}

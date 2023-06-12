import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router: Router) {
  }

  activeClass: string = "bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100";
  inactiveClass: string = "border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100";

  //navbar showing
  shouldShowNavbar(): boolean {
    const currentRoute = this.router.url;
    return currentRoute !== '/admin';
  }
  currentRoute(): string {
    return this.router.url;
  }

}

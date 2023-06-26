import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-admin-teachers',
  templateUrl: './admin-teachers.component.html',
  styleUrls: ['./admin-teachers.component.scss']
})
export class AdminTeachersComponent implements OnInit {

  tutors: any
  constructor(private adminService: AdminServicesService, private authService: AuthserviceService, private router: Router) { }
  ngOnInit(): void {
    this.adminService.getAlltutors().subscribe((res) => {
      this.tutors = res.data
    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }
  view(id: string) {
    this.router.navigate([`/admin/viewtutor/${id}`])
  }

}

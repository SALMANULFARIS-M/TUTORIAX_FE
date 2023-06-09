import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']
})
export class AdminStudentsComponent implements OnInit {

  students: any
  constructor(private adminService: AdminService,private authService:AuthService) { }
  ngOnInit(): void {
    this.adminService.getAllstudents().subscribe((res) => {
      this.students = res.data

    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }

  block(id: string, flag: boolean) {
    let message: string = ''
    if (flag) {
      message = "you want to block the student"
    } else {
      message = "you want to unblock the student"
    }
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          access: flag
        }
        this.adminService.block(id, data).subscribe((res) => {
          this.ngOnInit()
          Swal.fire(
            'Done!',
            res.message,
            'success'
          )
        }, (error: any) => {
          this.authService.handleError(error.status)
        })
      }
    })

  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-viewtutor',
  templateUrl: './viewtutor.component.html',
  styleUrls: ['./viewtutor.component.scss']
})
export class ViewtutorComponent implements OnInit {

  id: any;
  tutor: any;
  Toast: any;
  constructor(private adminService: AdminService, private authService: AuthService, private route: ActivatedRoute) {
    this.Toast = this.authService.Toast;
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.adminService.getTutor(this.id).subscribe((res) => {
      this.tutor = res.tutor
    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }



  approve(id: string) {
    this.adminService.tutorApproval(id).subscribe((res) => {
      if (res.status) {
        this.Toast.fire({
          icon: 'success',
          title: "Tutor has approved for our website"
        })
      }
      this.ngOnInit();
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
        this.adminService.tuorBlock(id, data).subscribe((res) => {
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

import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import Swal from 'sweetalert2';


const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']
})
export class AdminStudentsComponent implements OnInit {

  students: any
  constructor(private adminService: AdminServicesService) { }
  ngOnInit(): void {
    this.adminService.getAllstudents().subscribe((res) => {
      this.students = res.data
console.log(this.students,"sdfk");

    },(error: any) => {
        if (error.status === 400) {
          Toast.fire({
            icon: 'warning',
            title: error.error.message
          })
        }
      })
  }
}

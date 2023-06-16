import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

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
const app = initializeApp({
  apiKey: "AIzaSyBuDl_nSTpKOc6a_FzabCvQW2UtqnLuffE",
  authDomain: "e-mail-otp-verification.firebaseapp.com",
  projectId: "e-mail-otp-verification",
  storageBucket: "e-mail-otp-verification.appspot.com",
  messagingSenderId: "481187461752",
  appId: "1:481187461752:web:f8255469cf48b74e5d0b8d",
  measurementId: "G-DGKX0B9QDQ"
});

const storage = getStorage(app)
@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {
  courses: any;
  constructor(private adminService: AdminServicesService, private spinner: NgxSpinnerService,
    private router: Router) { }

  ngOnInit(): void {
    this.adminService.getAllCourses().subscribe((result: any) => {
      if (result.status) {
        this.courses = result.data
      }
    }, (error: any) => {
      if (error.status === 400) {
        Toast.fire({
          icon: 'warning',
          title: error.error.message
        })
      }
    });
  }

  toAdd() {
    this.router.navigate(['/admin/addcourse'])
  }
  toEdit(id: string) {
    this.router.navigate([`/admin/editcourse/${id}`])
  }
  toView(id: string) {
    this.router.navigate([`/admin/viewcourse/${id}`])
  }

  deleteCourse(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.adminService.deleteCourses(id).subscribe((res) => {
          if (res.status) {
            // Create storage references for the files
            const thumbnailStorageRef = ref(storage, res.thumbnailURL);
            const videoStorageRef = ref(storage, res.videoURL);

            // Delete both files concurrently
            Promise.all([
              deleteObject(thumbnailStorageRef),
              deleteObject(videoStorageRef)
            ])
              .then(() => {
                this.spinner.hide();
                this.ngOnInit()
                Swal.fire(
                  'Deleted!',
                  res.message,
                  'success'
                )
              })
              .catch((error) => {
                this.spinner.hide();
                Swal.fire(
                  'Error deleting files:eleted!',
                  error,
                  'error'
                )
              });
          }
        }, (error: any) => {
          if (error.status === 400) {
            Toast.fire({
              icon: 'warning',
              title: error.error.message
            })
          }
        })
      }
    })
  }
}

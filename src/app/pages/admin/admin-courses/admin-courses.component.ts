import { Component, OnInit } from '@angular/core';
import { deleteObject, ref } from 'firebase/storage';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-admin-courses',
  templateUrl: './admin-courses.component.html',
  styleUrls: ['./admin-courses.component.scss']
})
export class AdminCoursesComponent implements OnInit {

  courses: any;
  storage: any;
  constructor(private adminService: AdminService, private spinner: NgxSpinnerService,
    private router: Router, private authService: AuthService) {
    this.storage = this.authService.storage
  }

  ngOnInit(): void {
    this.adminService.getAllCourses().subscribe((result: any) => {
      if (result.status) {
        this.courses = result.data
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
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
            const thumbnailStorageRef = ref(this.storage, res.thumbnailURL);
            const videoStorageRef = ref(this.storage, res.videoURL);

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
          this.authService.handleError(error.status)
        })
      }
    })
  }
}

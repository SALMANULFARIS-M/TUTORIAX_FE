import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-coursepage',
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.scss']
})
export class CoursepageComponent {

  constructor( private fb: FormBuilder,private adminService: AdminServicesService, private toastr: ToastrService, private router: Router) {
  }

  //declaration
  selectedThumbnail: string | null = null;
  submit = false;

  //interface of formdata
  courseForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    date: ['', Validators.required],
    price: ['', Validators.required],
    video: ['', Validators.required],
    thumbnail: ['', Validators.required],
    description: ['', Validators.required]
  });
  get f() {
    return this.courseForm.controls;
  }

  onSubmit(): void {
    // Access form values using Angular's Reactive Forms
    const title = this.courseForm.get('title')?.value;
    const author = this.courseForm.get('author')?.value;
    const date = this.courseForm.get('date')?.value;
    const price = this.courseForm.get('price')?.value;
    const videoFile = this.courseForm.get('video')?.value as unknown as File;
    const thumbnailFile = this.courseForm.get('thumbnail')?.value as unknown as File;
    const description = this.courseForm.get('description')?.value;

    if (thumbnailFile && videoFile) {
      // Upload thumbnail file
      const thumbnailRef = ref(storage, "Tutoriax/thumbnails/" + thumbnailFile.name);
      uploadBytes(thumbnailRef, thumbnailFile).then(() => {
        // Get the download URL of the thumbnail file
        getDownloadURL(thumbnailRef).then((thumbnailURL) => {
          // Upload video file
          const videoRef = ref(storage, "Tutoriax/videos/" + videoFile.name);
          uploadBytes(videoRef, videoFile).then(() => {
            // Get the download URL of the video file
            getDownloadURL(videoRef).then((videoURL) => {
              // Prepare the form data to send to the backend
              const data = {
                title: title,
                author: author,
                date: date,
                price: price,
                video: videoURL,
                thumbnail: thumbnailURL,
                description: description
              };
              // Send the data to the backend or perform further operations
              this.adminService.addCourse(data).subscribe((result: any) => {
                if (result.status) {
                  this.toastr.success(result.message, '');
                  this.router.navigate(['/admin/courses']);
                }
              }, (error: any) => {
                if (error.status === 400) {
                  Toast.fire({
                    icon: 'warning',
                    title: error.error.message
                  })
                }
              });
            }).catch((error) => {
              // Handle error while getting video download URL
              console.error('Error getting video download URL:', error);
            });
          }).catch((error) => {
            // Handle error while uploading video file
            console.error('Error uploading video file:', error);
          });
        }).catch((error) => {
          // Handle error while getting thumbnail download URL
          console.error('Error getting thumbnail download URL:', error);
        });
      }).catch((error) => {
        // Handle error while uploading thumbnail file
        console.error('Error uploading thumbnail file:', error);
      });
    }
  }
}

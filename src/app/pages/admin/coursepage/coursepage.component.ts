import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class CoursepageComponent implements OnInit {

  constructor(private fb: FormBuilder, private adminService: AdminServicesService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute) {
  }

  //declaration
  course: any
  selectedThumbnail: string | null = null;
  submit: boolean = false;
  isLoading: boolean = false
  id: any;
  action: any[] = [];
  courseId: string | null = null;
  view: Boolean = false;

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      // Extract the first two path segments
      this.action = segments.slice(0, 2).map(segment => segment.path);
      if (this.action[0] == 'editcourse') {
        this.id = this.route.snapshot.paramMap.get('id')
        this.adminService.getCourse(this.id).subscribe((res) => {

          this.course = res.course
          // Update the form controls with the received data
          this.courseForm.patchValue({
            title: this.course.title,
            author: this.course.author,
            date: this.course.date.split("T")[0],
            price: this.course.price,
            description: this.course.description
          });
        })
      } else if (this.action[0] == 'viewcourse') {
        this.view = true
      }
    });
  }



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

    if (this.action[0] == 'editcourse') {





    } else {
      if (this.courseForm.valid) {
        this.isLoading = true
        const thumbnailInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        const videoInput = document.getElementById('video-input') as HTMLInputElement;

        if (thumbnailInput.files && videoInput.files) {

          const thumbnailFile: File = thumbnailInput.files?.[0];
          const videoFile: File = videoInput.files?.[0];

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
                    title: this.courseForm.get('title')?.value,
                    author: this.courseForm.get('author')?.value,
                    date: this.courseForm.get('date')?.value,
                    price: this.courseForm.get('price')?.value,
                    video: videoURL,
                    thumbnail: thumbnailURL,
                    description: this.courseForm.get('description')?.value
                  };
                  // Send the data to the backend or perform further operations
                  this.adminService.addCourse(data).subscribe((result: any) => {
                    if (result.status) {
                      this.toastr.success(result.message, '');
                      this.isLoading = false
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
  }

}


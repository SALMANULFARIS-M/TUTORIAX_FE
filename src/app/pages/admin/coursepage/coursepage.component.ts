import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ToastrService } from 'ngx-toastr';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-coursepage',
  templateUrl: './coursepage.component.html',
  styleUrls: ['./coursepage.component.scss']
})
export class CoursepageComponent implements OnInit {

  storage: any
  Toast: any
  constructor(private fb: FormBuilder, private adminService: AdminServicesService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute, private authService: AuthserviceService) {
    this.storage = this.authService.storage;
    this.Toast = this.authService.Toast;
  }

  //declaration
  course: any
  selectedThumbnail: string | null = null;
  submit: boolean = false;
  isLoading: boolean = false
  id: any;
  action: any[] = [];
  view: boolean = false;

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      // Extract the first two path segments
      this.action = segments.slice(0, 2).map(segment => segment.path);
      if (this.action[0] == 'editcourse' || this.action[0] == 'viewcourse') {
        this.id = this.route.snapshot.paramMap.get('id')
        this.adminService.getCourse(this.id).subscribe((res) => {
          this.course = res.course

          // Update the form controls with the received data
          this.courseForm.patchValue({
            title: this.course.title,
            author: this.course.author,
            date: this.course.date.split("T")[0],
            thumbnail: this.course.image_id,
            video: this.course.video_id,
            price: this.course.price,
            description: this.course.description
          });
          if (this.action[0] == 'viewcourse') {
            this.courseForm.disable();
            this.view = true
          }
        }, (error: any) => {
          this.authService.handleError(error.status)
        })
      }
    });
  }

  //interface of formdata
  courseForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    date: ['', Validators.required],
    price: ['', [Validators.required,Validators.pattern(/^[1-9]\d*$/)]],
    video: [''],
    thumbnail: [''],
    description: ['', Validators.required]
  });

  get f() {
    return this.courseForm.controls;
  }

  onSubmit(): void {
    // Access form values using Angular's Reactive Forms

    if (this.action[0] == 'editcourse') {

      if (this.courseForm.valid) {
        this.isLoading = true
        const thumbnailInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        const videoInput = document.getElementById('video-input') as HTMLInputElement;

        if (thumbnailInput.files) {
          const thumbnailFile: File = thumbnailInput.files?.[0];

          const thumbnailStorageRef = ref(this.storage, this.course.image_id);
          deleteObject(thumbnailStorageRef)
            .then(() => {
              // Upload thumbnail file
              const thumbnailRef = ref(this.storage, "Tutoriax/thumbnails/" + thumbnailFile.name);
              uploadBytes(thumbnailRef, thumbnailFile).then(() => {
                // Get the download URL of the thumbnail file
                getDownloadURL(thumbnailRef).then((thumbnailURL) => {
                  this.courseForm.patchValue({
                    thumbnail: thumbnailURL,
                  })
                })
              })
            })
        }
        if (videoInput.files) {
          const videoFile: File = videoInput.files?.[0];
          const videoStorageRef = ref(this.storage, this.course.video_id);
          deleteObject(videoStorageRef)
            .then(() => {
              // Upload thumbnail file
              const videoRef = ref(this.storage, "Tutoriax/thumbnails/" + videoFile.name);
              uploadBytes(videoRef, videoFile).then(() => {
                // Get the download URL of the video file
                getDownloadURL(videoRef).then((videoURL) => {
                  // Prepare the form data to send to the backend
                  this.courseForm.patchValue({
                    video: videoURL,
                  })
                })
              })
            })
        }

        const data = this.courseForm.value
        // Send the data to the backend or perform further operations
        this.adminService.editCourse(this.course._id, data).subscribe((result: any) => {
          if (result.status) {
            this.toastr.success(result.message, '');
            this.isLoading = false
            this.ngOnInit()
          }
        }, (error: any) => {
          this.authService.handleError(error.status)
        });
      }

    } else {
      if (this.courseForm.valid) {
        this.isLoading = true
        const thumbnailInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        const videoInput = document.getElementById('video-input') as HTMLInputElement;

        if (thumbnailInput.files && videoInput.files) {

          const thumbnailFile: File = thumbnailInput.files?.[0];
          const videoFile: File = videoInput.files?.[0];

          // Upload thumbnail file
          const thumbnailRef = ref(this.storage, "Tutoriax/thumbnails/" + thumbnailFile.name);
          uploadBytes(thumbnailRef, thumbnailFile).then(() => {
            // Get the download URL of the thumbnail file
            getDownloadURL(thumbnailRef).then((thumbnailURL) => {
              // Upload video file
              const videoRef = ref(this.storage, "Tutoriax/videos/" + videoFile.name);
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
                    this.authService.handleError(error.status)
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
        } else {
          this.Toast.fire({
            icon: 'warning',
            title: "Add the media files"
          })
        }
      }
    }
  }
}


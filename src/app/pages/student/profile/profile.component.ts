import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mobilePattern, number } from 'src/app/constants/patterns';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { TutorService } from 'src/app/services/tutor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = false;
  teacherProfile: boolean = false;
  submit: boolean = false;
  image: string = '';
  certificate: string = '';
  Toast: any;
  constructor(private fb: FormBuilder, private authService: AuthService, private studentService: StudentService,
    private tutorService: TutorService, private route: ActivatedRoute, private router: Router) {
    this.Toast = this.authService.Toast;
  }

  ngOnInit(): void {
    const routeUrl = this.router.url;
    // Check if the user is a teacher based on the route URL
    if (routeUrl.includes('tutor')) {
      this.teacherProfile = true;
      this.tutorService.getTeacher().subscribe((res) => {
        this.teacherForm.patchValue({
          fullName: res.data.fullName,
          mobile: res.data.mobile,
          email: res.data.email,
        });
        this.certificate = res.data.certificate
        if (res.data.image) {
          this.image = res.data.image
        }
        this.teacherForm.get('mobile')?.disable();
      }, (error) => {
        this.authService.handleError(error.status)
      })
    } else {
      this.studentService.getStudent().subscribe((res) => {
        this.studentForm.patchValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          mobile: res.data.mobile,
          email: res.data.email,
        });
        if (res.data.image) {
          this.image = res.data.image
        }
        this.studentForm.get('mobile')?.disable();
      }, (error) => {
        this.authService.handleError(error.status)
      })
    }
  }
  //interface of formdata
  studentForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
    email: ['', [Validators.required, Validators.email]],
  });

  teacherForm = this.fb.group({
    fullName: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
    email: ['', [Validators.required, Validators.email]],
  });

  //image editing
  onImageSelected(event: any) {
    this.isLoading = true;
    const file: File = event.target.files[0];
    if (file) {
      const promise = this.authService.uploadImage(file);
      promise.then((url) => {
        if (this.teacherProfile) {
          const data = {
            image: url
          }
          this.tutorService.updateimage(data).subscribe((res) => {
            if (res.status) {
              this.Toast.fire({
                icon: 'success',
                title: "Successfully Updated"
              })
              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.image = e.target.result;
              };
              reader.readAsDataURL(file);
            }
          }, (error) => {
            this.authService.handleError(error.status)
          }).add(() => {
            this.isLoading = false; // Set isLoading to false after the update completes
          });

        } else {
          const data = {
            image: url
          }
          this.studentService.updateimage(data).subscribe((res) => {
            if (res.status) {
              this.Toast.fire({
                icon: 'success',
                title: "Successfully Updated"
              })
              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.image = e.target.result;
              };
              reader.readAsDataURL(file);
            }
          }, (error) => {
            this.authService.handleError(error.status)
          }).add(() => {
            this.isLoading = false; // Set isLoading to false after the update completes
          });
        }
      });
    }
  }

  get s() {
    return this.studentForm.controls;
  }
  get t() {
    return this.teacherForm.controls;
  }

  //student form submit according to conditon
  stdSubmit() {
    this.submit = true;
    if (this.studentForm.valid) {
      const formdata = this.studentForm.value
      this.studentService.updateStudent(formdata).subscribe((res) => {
        if (res.status) {
          this.Toast.fire({
            icon: 'success',
            title: "Successfully Updated"
          })
        }
        this.ngOnInit();
      }, (error) => {
        this.authService.handleError(error.status)
      })
    }
  }

  //teacher form submit according to conditon
  tchrSubmit() {
    this.submit = true;
    if (this.studentForm.valid) {
      const formdata = this.studentForm.value
      this.studentService.updateStudent(formdata).subscribe((res) => {
        if (res.status) {
          this.Toast.fire({
            icon: 'success',
            title: "Successfully Updated"
          })
        }
        this.ngOnInit();
      }, (error) => {
        this.authService.handleError(error.status)
      })
    }
  }

}


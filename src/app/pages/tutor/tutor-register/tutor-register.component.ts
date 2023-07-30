import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TutorService } from 'src/app/services/tutor.service';
import { mobilePattern, passwordPattern, name } from "../../../constants/patterns";


//typescript cant obtain window directly
interface CustomWindow extends Window {
  recaptchaVerifier: any;
  confirmationResult: any;
}

// Define the window object of type CustomWindow
declare const window: CustomWindow;
declare const google: any;
@Component({
  selector: 'app-tutor-register',
  templateUrl: './tutor-register.component.html',
  styleUrls: ['./tutor-register.component.scss']
})

export class TutorRegisterComponent implements OnInit {
  //declare a variable

  file: File | undefined;
  submit: boolean = false;
  otpFlag: boolean = false;
  phoneNumber: string = "";
  isLoading: boolean = false;
  otp: string[] = ['', '', '', '', '', ''];
  formData: any;
  storage: any;
  auth: any
  Toast: any

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router, private tutorService: TutorService,
    private toastr: ToastrService) {
    this.auth = this.authService.auth;
    this.storage = this.authService.storage;
    this.Toast = this.authService.Toast;
  }
  ngOnInit(): void {
    if (this.authService.istutorLoggedIn()) {
      this.router.navigate(['/tutor']);
    }
  }
  imageInput(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    this.file = fileInput.files?.[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageLabel = document.getElementById('image-label') as HTMLElement;
        imageLabel.style.backgroundImage = `url(${e.target.result})`;
      };
      const fileName = this.file.name;
      reader.readAsDataURL(this.file);
    }
  }

  //registration form  interface
  registrationForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(name)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
    certificate: ['', Validators.required],
  });

  //is used to conveniently access the controls of the registrationForm FormGroup.
  //It returns the controls property of the registrationForm object.
  get f() {
    return this.registrationForm.controls;
  }

  //otp input
  onInput(event: Event, index: number) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();
    if (value) {
      this.otp[index] = value;
      if (index < this.otp.length - 1) {
        const nextInput = inputElement.nextElementSibling as HTMLInputElement;
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otp[index + 1] && index > 0) {
      event.preventDefault(); // Prevent the default Backspace behavior
      const currentInput = event.target as HTMLInputElement;
      const prevInput = currentInput.previousElementSibling as HTMLInputElement;
      this.otp[index] = ''; // Clear the value in the previous input field
      currentInput.value = ''; // Clear the value visually
      prevInput.focus(); // Move the cursor back to the previous input field
    }
  }

  //captchaverify
  onCaptchaVerify(number: string) {

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response: any) => {
          this.otpSend(number)
        },
        'expired-callback': () => {
        }
      }, this.auth);
    }
  }


  //after validate from backend send otp
  otpSend(phoneNumber: string) {
    this.onCaptchaVerify(phoneNumber)
    const appVerifier = window.recaptchaVerifier
    const phoneFormat: string = '+91' + phoneNumber

    signInWithPhoneNumber(this.auth, phoneFormat, appVerifier)
      .then((confirmationResult) => {
        this.Toast.fire({
          icon: 'success',
          title: 'An OTP send to your mobile number Please Verify'
        })
        // Hide the reCAPTCHA div
        document.getElementById("recaptcha-container")!.style.display = "none";
        this.otpFlag = true;
        window.confirmationResult = confirmationResult;
      }).catch((error) => {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/invalid-phone-number':
            errorMessage = 'Invalid phone number format.';
            break;
          case 'auth/too-short':
            errorMessage = 'Phone number is too short.';
            break;
          default:
            errorMessage = 'An error occurred during phone number verification.';
            break;
        }
        this.Toast.fire({
          icon: 'error',
          title: errorMessage
        });
      })
  }

  //otpverification
  otpVerify() {
    const otpString: string = this.otp.join('')
    if (otpString.length < 6) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please enter full otp'
      })
    } else {
      this.isLoading = true;
      window.confirmationResult.confirm(otpString).then((result: any) => {
        if (this.file) {
          const imageFile: File = this.file;
          // Upload thumbnail file
          const imageRef = ref(this.storage, "Tutoriax/thumbnails/" + imageFile.name);
          uploadBytes(imageRef, imageFile).then(() => {
            // Get the download URL of the thumbnail file
            getDownloadURL(imageRef).then((thumbnailURL) => {
              this.formData.certificate = thumbnailURL

              this.tutorService.insertTutor(this.formData).subscribe((result: any) => {
                if (result.status) {
                  this.formData = "";
                  this.toastr.success('Successfully registered', '');
                  localStorage.setItem('tutorjwt', result.token);
                  this.router.navigate(['/tutor']);
                } else {
                  this.Toast.fire({
                    icon: 'warning',
                    title: result.message
                  })
                }
              }, (error) => {
                this.authService.handleError(error.status)
              })
              this.isLoading = false;
            }).catch((error: any) => {
              this.isLoading = false;
              this.Toast.fire({
                icon: 'error',
                title: error,
              })
            });
          }).catch((error: any) => {
            this.isLoading = false;
            this.Toast.fire({
              icon: 'error',
              title: error,
            })
          });
        }
      }).catch((error: any) => {
        this.isLoading = false;
        this.Toast.fire({
          icon: 'error',
          title: 'Error verifying OTP. Please try again.',
        })
      });
    }
  }

  onSubmit() {
    this.submit = true;

    if (this.registrationForm.valid) {
      this.formData = this.registrationForm.value;
      const mobileValue: string | null | undefined = this.registrationForm.get('mobile')?.value;
      const mobile: number | null = mobileValue ? parseInt(mobileValue) : null;
      this.tutorService.checkTutorExist({ mobile: mobile }).subscribe((result: any) => {
        if (result.status) {
          this.otpSend(result.number)
        } else {
          this.Toast.fire({
            icon: 'error',
            title: result.message
          })
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      })
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from "@angular/forms";//forms
//ts particles
import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from 'tsparticles';
//toast  and sweet  alert
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StudentService } from '../../../services/student.service';
import { environment } from 'src/environments/environment.development';
//firebase
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { AuthService } from 'src/app/services/auth.service';
import { mobilePattern, passwordPattern, name } from "../../../constants/patterns";


//typescript cant obtain window directly
interface CustomWindow extends Window {
  onGoogleLibraryLoad: () => void;
  recaptchaVerifier: any;
  confirmationResult: any;
}

// Define the window object of type CustomWindow
declare const window: CustomWindow;
declare const google: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private studentService: StudentService, private router: Router, private toastr: ToastrService,
    private authService: AuthService) {
    this.auth = this.authService.auth;
    this.Toast = this.authService.Toast;
  }

  //declare a variable
  submit: boolean = false;
  otpFlag: boolean = false;
  phoneNumber: string = "";
  isLoading: boolean = false;
  minutes: number = 1;
  seconds: number = 0;
  resend: boolean = false;
  auth: any
  Toast: any
  otp: string[] = ['', '', '', '', '', ''];
  formData: any;
  ph: string = '';
  ngOnInit(): void {
    const currentRoute = this.router.url;
    if (this.authService.isStudentLoggedIn()) {
      this.router.navigate(['/'])
    }
    if (currentRoute == '/register' || currentRoute == '/login') {
      const topNav = document.getElementById('top-nav') as HTMLElement;
      topNav.classList.add('hidden');
    }
  }


//Google singing
  handleresponse() {
    this.authService.GoogleAuth().then((res) => {
      const data = {
        credential: res
      }
      this.studentService.googleSignIN(data).subscribe((result: any) => {
        if (result.status) {
          this.toastr.success('Successfully Entered', '');
          localStorage.setItem('studentjwt', result.token);
          const topNav = document.getElementById('top-nav') as HTMLElement;
          topNav.classList.remove('hidden');
          this.router.navigate(['/']);
        } else {
          this.Toast.fire({
            icon: 'warning',
            title: result.message
          })
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      })
    })
  }

  //registration form  interface
  registrationForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(name)]],
    lastName: ['', [Validators.required, Validators.pattern(name)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
    cpassword: ['', [Validators.required, this.confirmPasswordValidator()]]
  });

  //is used to conveniently access the controls of the registrationForm FormGroup.
  //It returns the controls property of the registrationForm object.
  get f() {
    return this.registrationForm.controls;
  }

  // Custom validator to check password confirmation
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.root.get('password');
      const confirmPassword = control.value;
      // Check if password and confirmPassword match
      if (password && confirmPassword !== password.value) {
        return { confirmPasswordMismatch: true };
      }
      return null;
    };
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
    this.resend = false;
    this.onCaptchaVerify(phoneNumber)

    const appVerifier = window.recaptchaVerifier
    const phoneFormat: string = '+91' + phoneNumber
    this.ph = phoneNumber
    if (appVerifier) {
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
          const interval = setInterval(() => {
            if (this.seconds > 0 || this.minutes > 0) {
              if (this.seconds === 0) {
                this.minutes--;
                this.seconds = 59;
              } else {
                this.seconds--;
              }
            } else {
              clearInterval(interval);
              this.resend = true; // Change the boolean variable to true
            }
          }, 1000);

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
  }

  resendOtp() {
    this.minutes = 0;
    this.seconds = 30;
    const ph = this.ph
    this.otpSend(ph)
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
        this.studentService.insertUser(this.formData).subscribe((result: any) => {
          if (result.status) {
            this.formData = "";
            this.toastr.success('Successfully registered', '');
            localStorage.setItem('studentjwt', result.token);
            const topNav = document.getElementById('top-nav') as HTMLElement;
            topNav.classList.remove('hidden');
            this.router.navigate(['/']);
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
        this.Toast.fire({
          icon: 'success',
          title: 'Error verifying OTP. Please try again.',
        })
      });
    }
  }

  //submit button
  onSubmit() {
    this.submit = true;
    if (this.registrationForm.valid) {
      this.formData = this.registrationForm.value;
      this.studentService.checkUserExist(this.formData).subscribe((result: any) => {
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

  //ts particles animation
  id = "tsparticles";
  /* Starting from 1.19.0 you can use a remote url (AJAX request) to a JSON with the configuration */
  particlesUrl = "http://foo.bar/particles.json";

  /* or the classic JavaScript object */
  particlesOptions = {
    background: {
      color: {
        value: "#0d47a1",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ClickMode.push,
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: true,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 6,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {
    // console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }

}

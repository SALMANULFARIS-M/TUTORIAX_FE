import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from "@angular/forms";//forms
//ts particles
import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from 'tsparticles';
//toast  and sweet  alert
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Input, initTE } from "tw-elements";//tw-elements
import { Router } from '@angular/router';
import { StudentServicesService } from '../../../services/student-services.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment.development';
//firebase

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';


//typescript cant obtain window directly
interface CustomWindow extends Window {
  recaptchaVerifier: any;
  confirmationResult: any;
}

// Define the window object of type CustomWindow
declare const window: CustomWindow;
declare const google: any;

//firebase config
const app = initializeApp({
  apiKey: "AIzaSyBuDl_nSTpKOc6a_FzabCvQW2UtqnLuffE",
  authDomain: "e-mail-otp-verification.firebaseapp.com",
  projectId: "e-mail-otp-verification",
  storageBucket: "e-mail-otp-verification.appspot.com",
  messagingSenderId: "481187461752",
  appId: "1:481187461752:web:f8255469cf48b74e5d0b8d",
  measurementId: "G-DGKX0B9QDQ"
});
const auth = getAuth(app);
auth.languageCode = 'it';


const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  constructor(private fb: FormBuilder, private studentService: StudentServicesService, private router: Router, private toastr: ToastrService,
    private cookieService: CookieService, private _ngZone: NgZone, private socialAuthService: SocialAuthService) { }

  //declare a variable
  submit: boolean = false;
  otpFlag: boolean = false;
  phoneNumber: string = "";
  isLoading: boolean = false;
  otp: string[] = ['', '', '', '', '', ''];
  formData: any;

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: environment.clientId,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const buttonDiv = document.getElementById("buttonDiv");
      google.accounts.id.renderButton(
        buttonDiv,
        { theme: "filled_blue", size: "large", width: "100%", text: "continue_with" }
      );
      google.accounts.id.prompt((notification: CredentialResponse) => { });
    };
  }


  //registration form  interface
  registrationForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*[a-zA-Z][a-zA-Z ]*$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*[a-zA-Z][a-zA-Z ]*$/)]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
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
      }, auth);
    }
  }

  //after validate from backend send otp
  otpSend(phoneNumber: string) {
    this.onCaptchaVerify(phoneNumber)
    const appVerifier = window.recaptchaVerifier
    const phoneFormat: string = '+91' + phoneNumber

    signInWithPhoneNumber(auth, phoneFormat, appVerifier)
      .then((confirmationResult) => {
        Toast.fire({
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
        Toast.fire({
          icon: 'error',
          title: errorMessage
        });
      })
  }


  //otpverification
  otpVerify() {
    const otpString: string = this.otp.join('')
    if (otpString.length < 6) {
      Toast.fire({
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
            this.cookieService.set('studentjwt', result.token, 1);
            this.router.navigate(['/']);
          } else {
            Toast.fire({
              icon: 'warning',
              title: result.message
            })
          }
        }, (error) => {
          Toast.fire({
            icon: 'warning',
            title: error.error.message
          })
        })
        this.isLoading = false;
      }).catch((error: any) => {
        Toast.fire({
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
          Toast.fire({
            icon: 'error',
            title: result.message
          })
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
    console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }

}

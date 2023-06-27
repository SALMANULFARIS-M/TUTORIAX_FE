import { Component, OnInit } from '@angular/core';
import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { PromptMomentNotification } from 'google-one-tap';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { AuthserviceService } from 'src/app/services/authservice.service';

//typescript cant obtain window directly
interface CustomWindow extends Window {
  recaptchaVerifier: any;
  confirmationResult: any;
}

interface Credentials {
  mobile: string;
  password: string;
}

// Define the window object of type CustomWindow
declare const window: CustomWindow;
declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  auth: any;
  Toast: any;
  constructor(private fb: FormBuilder, private router: Router, private studentService: StudentServicesService, private cookieService: CookieService,
    private toastr: ToastrService, private authService: AuthserviceService) {
    this.auth = this.authService.auth;
    this.Toast = this.authService.Toast;
  }

  //declare variable
  modal: boolean = false;
  submit: boolean = false;
  fpsubmit: boolean = false;
  fpData!: Credentials;
  otpFlag: boolean = false;
  phoneNumber: string = "";
  isLoading: boolean = false;
  password: boolean = false;
  otp: string[] = ['', '', '', '', '', ''];
  ngOnInit(): void {
    const currentRoute = this.router.url;
    if (currentRoute == '/register' || currentRoute == '/login') {
      const topNav = document.getElementById('top-nav') as HTMLElement;
      topNav.classList.add('hidden');
    }
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: '360144361205-jcp24rraul11rocvispiq9u23sgg7n1e.apps.googleusercontent.com',
        auto_select: false,
        cancel_on_tap_outside: true
      });
      const buttonDiv = document.getElementById("buttonDiv");
      google.accounts.id.renderButton(
        buttonDiv,
        { theme: "filled_blue", size: "large", width: "100%", text: "continue_with" }
      );
      google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    };
  }

  modalShow(a: string) {
    if (a == 'show') {
      this.modal = true
    } else {
      this.modal = false
    }
  }

  //interface of formdata
  registrationForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]]
  });
  get f() {
    return this.registrationForm.controls;
  }

  //interface of formdata
  forgotPassword = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
    password: ['', Validators.required]
  });

  get p() {
    return this.forgotPassword.controls;
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
      }).catch((error: any) => {
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
        this.password = true;
        this.otpFlag = false;
        this.isLoading = false;
        this.Toast.fire({
          icon: 'success',
          title: 'verified,Enter new password',
        })
      }).catch((error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error verifying OTP. Please try again.',
        })
      });
    }
  }

  submitForm() {
    if (this.password) {
      this.savePassword();
    } else {
      this.forgotSubmit();
    }
  }


  savePassword() {
    if (this.forgotPassword.valid) {
      this.isLoading = true;
      const data = this.forgotPassword.value;
      this.studentService.savePassword(data).subscribe((result: any) => {
        if (result.status) {
          this.isLoading = false;
          this.modal = false;
          this.toastr.success('New password save', 'success');
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

  forgotSubmit() {
    this.fpsubmit = true
    const mobileControl = this.forgotPassword.get('mobile');
    if (mobileControl?.valid) {
      this.isLoading = true;
      const mobileNumber = mobileControl.value;
      this.studentService.checkUserExist({ mobile: mobileNumber }).subscribe((result: any) => {
        if (result.status == false) {
          this.isLoading = false;
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

  onSubmit() {
    this.submit = true;
    if (this.registrationForm.valid) {
      // Access the form data
      const formData = this.registrationForm.value;
      // Send the form data to the server
      this.studentService.login(formData).subscribe((result: any) => {
        if (result.status) {
          this.cookieService.set('studentjwt', result.token, 1); // 1 days expiration
          this.toastr.success('successfully logged', '');
          const topNav = document.getElementById('top-nav') as HTMLElement;
          topNav.classList.remove('hidden');
          this.router.navigate(['/']);
        } else {
          this.toastr.error(result.message, '');
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    }
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

  //Ts particles animation
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
    console.log(engine);

    // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }

}

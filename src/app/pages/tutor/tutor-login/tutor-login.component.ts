import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { TutorService } from 'src/app/services/tutor.service';
import { mobilePattern,passwordPattern } from "../../../constants/patterns";


@Component({
  selector: 'app-tutor-login',
  templateUrl: './tutor-login.component.html',
  styleUrls: ['./tutor-login.component.scss']
})
export class TutorLoginComponent implements OnInit {

  submit: boolean = false;
  constructor(private authService: AuthService, private tutorService: TutorService, private router: Router, private fb: FormBuilder,
    private cookieService:CookieService,private toastr:ToastrService) { }
  ngOnInit(): void {
    if (this.authService.istutorLoggedIn()) {
      this.router.navigate(['/tutor']);
    }
  }


  //registration form  interface
  registrationForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(mobilePattern)]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]],
  });

  //is used to conveniently access the controls of the registrationForm FormGroup.
  //It returns the controls property of the registrationForm object.
  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submit = true;

    if (this.registrationForm.valid) {
            const formData = this.registrationForm.value;
      // Send the form data to the server
      this.tutorService.login(formData).subscribe((result: any) => {
        if (result.status) {
          this.cookieService.set('tutorjwt', result.token, 1); // 1 days expiration
          this.toastr.success('successfully logged', '');
          this.router.navigate(['/tutor']);
        } else {
          this.toastr.error(result.message, '');
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    }
  }

}

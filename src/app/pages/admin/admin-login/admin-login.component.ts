import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { passwordPattern } from "../../../constants/patterns";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  Toast: any;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private adminService: AdminService,
    private toastr: ToastrService) {
    this.Toast = this.authService.Toast;
  }

  //declaration
  submit: boolean = false

  ngOnInit(): void {
    if (this.authService.isAdminLoggedIn()) {
      this.router.navigate(['/admin'])
    }
  }

  //interface of formdata
  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(passwordPattern)]]
  });
  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submit = true;
    if (this.registrationForm.valid) {
      // Access the form data
      const formData = this.registrationForm.value;
      // Send the form data to the server
      this.adminService.login(formData).subscribe((result: any) => {
        if (result.status) {
          localStorage.setItem('adminjwt', result.token); // 1 days expiration
          this.toastr.success('successfully logged', '');
          this.router.navigate(['/admin']);
        }
      }, (error: any) => {
        if (error.status == 401) {
          this.Toast.fire({
            icon: 'warning',
            title: error.message
          })
        } else {
          this.authService.handleError(error.status)
        }
      });
    }
  }

}

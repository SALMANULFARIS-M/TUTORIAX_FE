import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'autoprefixer';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  coupons: any;
  action: any;
  Toast: any;
  addPage: boolean = false;
  submit: boolean = false;
  isLoading: boolean = false;
  constructor(private authService: AuthserviceService, private adminService: AdminServicesService, private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) { this.Toast = this.authService.Toast; }
  ngOnInit(): void {

    this.route.url.subscribe(segments => {
      // Extract the first two path segments
      this.action = segments.slice(0, 2).map(segment => segment.path);
      if (this.action[0] == 'addcoupon') {
        this.addPage = true;
      }
    });

    this.adminService.getCoupons().subscribe((res) => {
      this.coupons = res.coupons
    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }

  //interface of formdata
  couponForm = this.fb.group({
    code: ['', Validators.required],
    discountPercentage: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    maxDiscount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    minAmount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    expDate: ['', Validators.required]
  });
  get f() {
    return this.couponForm.controls;
  }
  toAdd() {
    this.router.navigate(['/admin/addcoupon'])
  }
  deleteCoupon(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "you want remove the coupon",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.adminService.deleteCoupon(id).subscribe((res) => {
          this.ngOnInit()
          Swal.fire(
            'Deleted!',
            "The coupon removed",
            'success'
          )
        }, (error: any) => {
          this.authService.handleError(error.status)
        })
      }
    })
  }

  onSubmit() {
    this.submit = true
    if (this.couponForm.valid) {
      this.isLoading = true;
      const formData = this.couponForm.value;
      this.adminService.addCoupon(formData).subscribe((res) => {
        if (res.status) {
          this.isLoading = false;
          this.Toast.fire({
            icon: 'success',
            title: "successfully added"
          })
          this.router.navigate(['/admin/coupons'])
        } else {
          this.Toast.fire({
            icon: 'warning',
            title: res.message
          })
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      })
    } else {
      this.Toast.fire({
        icon: 'warning',
        title: "All field are required"
      })
    }

  }


}


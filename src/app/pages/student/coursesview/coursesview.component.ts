import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import { StudentService } from 'src/app/services/student.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-coursesview',
  templateUrl: './coursesview.component.html',
  styleUrls: ['./coursesview.component.scss']
})
export class CoursesviewComponent implements OnInit {
  Toast: any;
  courseId: any;
  course: any;
  courseView: boolean = false;
  coupon: string = '';
  couponId: string = '';
  paymentHandler: any = null;
  modal: boolean = false;
  submit: boolean = false;
  constructor(private studentService: StudentService, private authService: AuthService, private fb: FormBuilder, private adminService: AdminService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute) {
    this.Toast = this.authService.Toast;
  }
  ngOnInit(): void {
    this.invokeStripe();
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.adminService.getCourse(this.courseId).subscribe((res) => {
      this.course = res.course
      if (this.authService.isStudentLoggedIn()) {
        const token = localStorage.getItem('studentjwt')
        const data = {
          courseId: this.courseId,
          token: token
        }
        this.studentService.checkPurchasedCourse(data).subscribe((res) => {
          if (res.status) {
            this.courseView = true
          }
        })
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    })
  }

  //interface of formdata
  reportForm = this.fb.group({
    text: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*[a-zA-Z])[a-zA-Z0-9\s]{4,}$/)]],
  });

  get f() {
    return this.reportForm.controls;
  }

  modalShow(a: string) {
    if (a == 'show') {
      this.modal = true
    } else {
      this.modal = false
    }
  }

  //coupon apply
  apply(price: number) {
    const token = localStorage.getItem('studentjwt')
    if (this.coupon.length > 0) {
      const data = {
        coupon: this.coupon,
        price: price,
        token: token
      }
      this.studentService.applyCoupon(data).subscribe((res) => {
        if (res.status) {
          this.course.price = res.price;
          this.couponId = res.coupon
          this.Toast.fire({
            icon: 'success',
            title: "succesfully applied"
          })
          this.coupon = '';
        } else {
          this.Toast.fire({
            icon: 'error',
            title: res.message
          })
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      })
    } else {
      this.Toast.fire({
        icon: 'warning',
        title: "Enter any code for apply"
      })
    }
  }

  //pay for course
  payNow(data: any) {
    if (this.authService.isStudentLoggedIn()) {
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51NKga2SFmoy1LlbxajC9b0FRvfviLHZhlj37RFaR2tjqkUCfIo5jfbqAK2LDWRbojoXiE7zAXrUJKBud8kYGrk7e00zj1nvIBB',
        locale: 'auto',
        token: function (stripeToken: any) {
          paymentStripe(stripeToken.id, data.price);
        },
      });
      const paymentStripe = (stripeToken: any, amount: any) => {
        const paymentData = {
          courseId: data._id,
          stripeToken: stripeToken,
          amount: parseInt(this.course.price),
          coupon: this.couponId
        };
        const usertoken = localStorage.getItem('studentjwt');
        this.studentService.pay(usertoken, paymentData).subscribe(
          (response) => {
            this.ngOnInit();
            this.toastr.success('Payment has been successfull!', 'Success');
          },
          (err) => {
            Swal.fire('Error', err.error.message, 'error');
          }
        );
      }
      const amountFormatted = this.course.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
      paymentHandler.open({
        name: 'Positronx',
        amount: '',
        panelLabel: `Pay ${amountFormatted}`,
      });
    } else {
      this.Toast.fire({
        icon: 'warning',
        title: "Please login to continue"
      })
    }
  }


  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NKga2SFmoy1LlbxajC9b0FRvfviLHZhlj37RFaR2tjqkUCfIo5jfbqAK2LDWRbojoXiE7zAXrUJKBud8kYGrk7e00zj1nvIBB',
          locale: 'auto',
          token: function (stripeToken: any) {
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }




  onSubmit(id: string) {
    this.submit = true;

    const token = localStorage.getItem('studentjwt')
    if (this.reportForm.valid) {
      const content = this.reportForm.get('text')
      let formData = {
        text: content?.value,
        token: token,
        courseId: id
      };
      this.studentService.reportVideo(formData).subscribe((res) => {
        if (res.status) {
          this.Toast.fire({
            icon: 'success',
            title: "Thank you for your feedback"
          })
          this.modalShow('hide')
          this.ngOnInit();
        } else {
          this.Toast.fire({
            icon: 'error',
            title: res.message
          })
          this.modalShow('hide')
        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      })
    }
  }
}

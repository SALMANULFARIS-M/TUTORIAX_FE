import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import Swal from 'sweetalert2';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthserviceService } from 'src/app/services/authservice.service';

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
  constructor(private studentService: StudentServicesService, private authService: AuthserviceService, private adminService: AdminServicesService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) {
    this.Toast = this.authService.Toast;
  }
  ngOnInit(): void {
    this.invokeStripe();
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.adminService.getCourse(this.courseId).subscribe((res) => {
      this.course = res.course
      if (this.authService.isStudentLoggedIn()) {
        const token = this.cookieService.get('studentjwt')
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

  apply(price: number) {
    const token = this.cookieService.get('studentjwt')
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
        const payload = {
          courseId: data._id,
          stripeToken: stripeToken,
          amount: this.course.price,
          coupon: this.couponId
        };
        const usertoken = this.cookieService.get('studentjwt');
        this.studentService.pay(usertoken, payload).subscribe(
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
}

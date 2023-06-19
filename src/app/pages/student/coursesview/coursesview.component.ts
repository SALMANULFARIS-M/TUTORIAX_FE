import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminServicesService } from 'src/app/services/admin-services.service';
import Swal from 'sweetalert2';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { CookieService } from 'ngx-cookie-service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})
@Component({
  selector: 'app-coursesview',
  templateUrl: './coursesview.component.html',
  styleUrls: ['./coursesview.component.scss']
})
export class CoursesviewComponent implements OnInit {
  courseId: any;
  course: any;
  courseView: boolean = false;
  paymentHandler: any = null;
  constructor(private studentService: StudentServicesService, private adminService: AdminServicesService, private toastr: ToastrService, private router: Router,
    private route: ActivatedRoute, private cookieService: CookieService) { }
  ngOnInit(): void {
    this.invokeStripe();
    this.courseId = this.route.snapshot.paramMap.get('id');

    this.adminService.getCourse(this.courseId).subscribe((res) => {
      this.course = res.course
      if (this.studentService.studentLog()) {
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
      if (error.status === 400) {
        Toast.fire({
          icon: 'warning',
          title: error.error.message
        })
      }
    })

  }

  payNow(data: any) {
    if (this.studentService.studentLog()) {
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
          amount: amount,
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
      const amountFormatted = data.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
      paymentHandler.open({
        name: 'Positronx',
        amount: '',
        panelLabel: `Pay ${amountFormatted}`,
      });
    } else {
      Toast.fire({
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

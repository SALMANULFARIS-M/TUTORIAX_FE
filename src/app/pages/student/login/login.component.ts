import { Component, OnInit } from '@angular/core';
import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { StudentServicesService } from 'src/app/services/student-services.service';


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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private studentService: StudentServicesService, private cookieService: CookieService, private toastr: ToastrService) { }

  //declare a variable
  options!: string;
  submit: boolean = false;
  ngOnInit(): void {

  }

//interface of formdata
  registrationForm = this.fb.group({
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]]
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
      this.studentService.login(formData).subscribe((result: any) => {
        if (result.status) {
          this.cookieService.set('studentjwt', result.token, 1); // 2 days expiration
          this.toastr.success('successfully logged', '');
          this.router.navigate(['/']);
        }
      }, (error: any) => {
        if (error.status === 400) {
          Toast.fire({
            icon: 'warning',
            title: error.error.message
          })
        }
      });
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

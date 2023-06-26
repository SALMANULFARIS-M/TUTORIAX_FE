import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { TutorserviceService } from 'src/app/services/tutorservice.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatShow: boolean = false;
  contacts: any;
  messages: any;
  message: string = '';
  Toast: any;
  room: any;
  constructor(private authService:AuthserviceService,private cookieService:CookieService,private tutorService:TutorserviceService,
    private studentService:StudentServicesService) {
    this.Toast = this.authService.Toast
  }
  ngOnInit(): void {
    const token = this.cookieService.get('tutorjwt');
    this.tutorService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  fullChat(id: string) {
    this.studentService.getAllMessages(id).subscribe((result: any) => {
      if (result.status) {
        this.chatShow = true
        this.messages = result.messages
        this.room = result.room
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  sendMessage() {
    if (this.message) {
      const data = {
        connection: this.room._id,
        sender: this.room.connection.teacher,
        receiver: this.room.connection.student,
        text: this.message
      }
      this.studentService.sendMessage(data).subscribe((result: any) => {
        if (result.status) {
          this.message = ''
          console.log(result.data);

        }
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    } else {
      this.Toast.fire({
        icon: 'warning',
        title: "Please enter some messages"
      })

    }
  }

}

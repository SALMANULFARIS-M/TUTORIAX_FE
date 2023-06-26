import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';

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

  constructor(private studentService: StudentServicesService, private cookieService: CookieService, private authService: AuthserviceService) {
    this.Toast = this.authService.Toast
  }
  ngOnInit(): void {
    const token = this.cookieService.get('studentjwt');
    this.studentService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
console.log(this.contacts,"dad");

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
        sender: this.room.connection.student,
        receiver: this.room.connection.teacher,
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

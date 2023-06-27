import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { io } from 'socket.io-client';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { TutorserviceService } from 'src/app/services/tutorservice.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatShow: boolean = false;
  contacts: any;
  messages: any[] = [];
  message: string = '';
  Toast: any;
  room: any; socket: any;

  constructor(private authService: AuthserviceService, private cookieService: CookieService, private tutorService: TutorserviceService,
    private studentService: StudentServicesService) {
    this.Toast = this.authService.Toast
  }
  ngOnInit(): void {

    this.socket = io(environment.socketIO_Endpoint);
    const token = this.cookieService.get('tutorjwt');
    this.tutorService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
        this.socket.emit("setup", result.id)
        this.scrollToBottom()
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });

    this.socket.on('message recieved', (newMessageReceived: any) => {
      this.messages.push(newMessageReceived);
      this.scrollToBottom()
    });

  }

  scrollToBottom() {
    const chatScroll = document.getElementById("chat-scroll") as HTMLElement;
    setTimeout(function () {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }, 100);
  }
  fullChat(id: string) {
    this.studentService.getAllMessages(id).subscribe((result: any) => {
      if (result.status) {
        this.chatShow = true
        this.messages = result.messages
        this.room = result.room
        this.socket.emit("join chat", this.room._id)
        this.scrollToBottom()
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  };

  sendMessage() {
    if (this.message) {
      const data = {
        connection: this.room._id,
        sender: this.room.connection.teacher._id,
        receiver: this.room.connection.student._id,
        text: this.message
      }
      this.studentService.sendMessage(data).subscribe((result: any) => {
        if (result.status) {
          this.message = ''
          this.socket.emit('new message', result.data)
          this.fullChat(result.id);
          this.scrollToBottom()

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

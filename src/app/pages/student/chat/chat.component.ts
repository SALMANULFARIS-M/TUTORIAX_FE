import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { StudentServicesService } from 'src/app/services/student-services.service';
import { io } from 'socket.io-client';
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
  room: any;
  socket: any;
  constructor(private studentService: StudentServicesService, private cookieService: CookieService, private authService: AuthserviceService) {
    this.Toast = this.authService.Toast
  }
  ngOnInit(): void {
    this.socket = io(environment.socketIO_Endpoint);
    const token = this.cookieService.get('studentjwt');
    this.studentService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
        this.socket.emit("setup", result.id)
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
    this.socket.on('message recieved', (newMessageReceived: any) => {
      this.messages.push(newMessageReceived);
      this.scrollToBottom()
    });
  }



  fullChat(id: string) {
    this.studentService.getAllMessages(id).subscribe((result: any) => {
      if (result.status) {
        this.chatShow = true
        if (this.chatShow) {
          this.scrollToBottom()
        }
        this.messages = result.messages
        this.room = result.room
        this.socket.emit("join chat", this.room._id)
        this.scrollToBottom()
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }
  scrollToBottom() {
    const chatScroll = document.getElementById("chat-scroll") as HTMLElement;
    setTimeout(function() {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }, 100);
  }
  sendMessage() {
    if (this.message) {
      const data = {
        connection: this.room._id,
        sender: this.room.connection.student._id,
        receiver: this.room.connection.teacher._id,
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

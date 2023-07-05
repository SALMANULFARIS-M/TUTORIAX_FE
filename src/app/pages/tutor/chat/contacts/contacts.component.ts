import { Component, Input, OnInit } from '@angular/core';
import { ChatComponent } from '../../chat/chat.component';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  @Input() c: any;


  constructor(private authService: AuthService, private studentService: StudentService, private chatComponent: ChatComponent) { }

  count!: number;
  viewed: boolean = false;
  socket: any;
  ngOnInit(): void {
    this.socket = io(environment.socketIO_Endpoint);
    const data = {
      connection: this.c._id,
      to: this.c.connection.student._id
    }
    this.studentService.chatSeen(data).subscribe((result: any) => {
      if (result.status) {
        this.count = parseInt(result.count)
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }
  fullChat(id: string, c: any) {
    this.viewed = true;
    this.count = 0;
    this.chatComponent.fullChat(id, c)
  }
  notification(newMessageReceived: any) {
    if (this.viewed == false) {
      if (this.c._id == newMessageReceived.connection_id._id) {
        this.count++
      }
    } else {
      this.studentService.chatviewed(newMessageReceived._id).subscribe((result: any) => {
      }, (error: any) => {
        this.authService.handleError(error.status)
      });
    }
  }
}

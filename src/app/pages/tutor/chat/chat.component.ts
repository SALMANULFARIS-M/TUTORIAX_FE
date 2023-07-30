import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { TutorService } from 'src/app/services/tutor.service';
import { environment } from 'src/environments/environment.development';
import { ContactsComponent } from './contacts/contacts.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChildren(ContactsComponent) contactsComponent!: QueryList<ContactsComponent>;
  chatShow: boolean = false;
  searchQuery: string = ''
  contacts: any;
  messages: any[] = [];
  message: string = '';
  Toast: any;
  room: any; socket: any;
  filteredContacts: any;
  viewerId: string = '';
  constructor(private authService: AuthService, private tutorService: TutorService,
    private studentService: StudentService) {
    this.Toast = this.authService.Toast
  }
  ngOnInit(): void {
    this.socket = io(environment.socketIO_Endpoint);
    const token = localStorage.getItem('tutorjwt');
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
      if (this.viewerId == newMessageReceived.connection_id._id) {
        this.messages.push(newMessageReceived);
      }
      this.contactsComponent.forEach((contactsComponent: ContactsComponent) => {
        contactsComponent.notification(newMessageReceived)
      });
      this.fetchContacts();
      this.scrollToBottom()
    });
  }

  fetchContacts() {
    const token = localStorage.getItem('tutorjwt');
    this.tutorService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
        this.scrollToBottom()
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  };


  scrollToBottom() {
    const chatScroll = document.getElementById("chat-scroll") as HTMLElement;
    setTimeout(function () {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }, 100);
  }

  fullChat(id: string, chat?: any) {
    this.viewerId = id;
    const data = {
      connection: id,
      to: chat ? chat.connection.student._id : undefined
    }
    this.studentService.getAllMessages(data).subscribe((result: any) => {
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
          this.fetchContacts();
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
  searchContacts() {
    // Filter the courses array based on the search query
    this.filteredContacts = this.contacts.filter((contact: any) => {
      // Convert both the course title and description to lowercase for case-insensitive search
      const firstName = contact.connection.student.firstName.toLowerCase();
      const lastName = contact.connection.student.lastName.toLowerCase();

      const searchQuery = this.searchQuery.toLowerCase();
      // Return true if the course title or description contains the search query
      return firstName.includes(searchQuery) || lastName.includes(searchQuery);
    });
  }
}

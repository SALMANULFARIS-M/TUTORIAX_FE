import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { StudentService } from 'src/app/services/student.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';
import { ContactsComponent } from './contacts/contacts.component';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChildren(ContactsComponent) contactsComponent!: QueryList<ContactsComponent>;

  chatShow: boolean = false;
  searchQuery: string = '';
  contacts: any;
  messages: any[] = [];
  message: string = '';
  Toast: any;
  room: any;
  socket: any;
  filteredContacts: any;
  viewerId: string = '';
  state: any;

  constructor(private studentService: StudentService, private authService: AuthService, private route: ActivatedRoute,
    private router: Router) {
    if (this.router.getCurrentNavigation()!?.extras?.state) {
      this.state = this.router.getCurrentNavigation()!?.extras?.state!['data'];
    }
    this.Toast = this.authService.Toast
  }

  ngOnInit(): void {
    if (this.state) {
      this.fullChat(this.state._id, this.state)
    }
    this.socket = io(environment.socketIO_Endpoint);
    const token = localStorage.getItem('studentjwt');
    this.studentService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
        this.socket.emit("setup", result.id)
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

  //fetch contacts
  fetchContacts() {
    const token = localStorage.getItem('studentjwt');
    this.studentService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  //  //fetching chat from according to contact
  fullChat(id: string, chat?: any) {
    this.viewerId = id;
    const data = {
      connection: id,
      to: chat ? chat.connection.teacher._id : undefined
    }

    this.studentService.getAllMessages(data).subscribe((result: any) => {
      if (result.status) {
        this.chatShow = true
        if (this.chatShow) {
          this.scrollToBottom()
        }
        this.messages = result.messages
        this.room = result.room
        this.socket.emit("join chat", this.room._id)
        // this.fetchContacts()
        this.scrollToBottom()
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

  //Scroll to bottom of chat
  scrollToBottom() {
    const chatScroll = document!.getElementById!("chat-scroll") as HTMLElement;
    setTimeout(function () {
      chatScroll!.scrollTop = chatScroll!.scrollHeight;
    }, 100);
  }

  //send a message to teacher
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

  //search contacts
  searchContacts() {
    // Filter the courses array based on the search query
    this.filteredContacts = this.contacts.filter((contact: any) => {
      // Convert both the course title and description to lowercase for case-insensitive search
      const title = contact.connection.teacher.fullName.toLowerCase();
      const searchQuery = this.searchQuery.toLowerCase();
      // Return true if the course title or description contains the search query
      return title.includes(searchQuery);
    });
  }

}

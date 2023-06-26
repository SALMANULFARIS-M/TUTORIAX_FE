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
  constructor(private studentService: StudentServicesService, private cookieService: CookieService, private authService: AuthserviceService) {
  }
  ngOnInit(): void {
    const token = this.cookieService.get('studentjwt');

    this.studentService.getAllChats(token).subscribe((result: any) => {
      if (result.status) {
        this.contacts = result.connections
      }
    }, (error: any) => {
      this.authService.handleError(error.status)
    });
  }

fullChat(id:string){
  this.studentService.getAllMessages(id).subscribe((result: any) => {
    if (result.status) {
      this.chatShow=true
      this.messages = result.messages
    }
  }, (error: any) => {
    this.authService.handleError(error.status)
  });

}

}

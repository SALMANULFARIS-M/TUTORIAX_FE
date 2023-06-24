import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthserviceService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-tutor-register',
  templateUrl: './tutor-register.component.html',
  styleUrls: ['./tutor-register.component.scss']
})
export class TutorRegisterComponent implements OnInit{

constructor(private authService:AuthserviceService,private fb:FormBuilder,){}
ngOnInit(): void {

}
imageInput(event:Event){
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageLabel = document.getElementById('image-label')as HTMLElement;
      imageLabel.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);
  }
}

}

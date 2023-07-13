import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Tutoriax_FE';

  ngOnInit(): void {
    var toTopButton = document.getElementById("to-top-button") as HTMLElement;

    // When the user scrolls down 200px from the top of the document, show the button
    window.onscroll = function () {
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        toTopButton.classList.remove("hidden");
      } else {
        toTopButton.classList.add("hidden");
      }
    }
  }
  goToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}

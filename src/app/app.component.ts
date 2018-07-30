import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';
  onActivate(event) {
    window.scroll(0,0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)


    // smooth
    // let scrollToTop = window.setInterval(() => {
    //   let pos = window.pageYOffset;
    //   if (pos > 0) {
    //       window.scrollTo(0, pos - 20); // how far to scroll on each step
    //   } else {
    //       window.clearInterval(scrollToTop);
    //   }
    // }, 16);

    // condation
    // if e.constructor.name
    
  }
}

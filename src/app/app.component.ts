import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';

  // https://stackoverflow.com/questions/48048299/angular-5-scroll-to-top-on-every-route-click
  onActivate() {
    window.scroll(0,0);
  }
}

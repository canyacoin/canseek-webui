import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Store } from "./store";
import { Router } from '@angular/router';
import { ContractsService } from './services/contracts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';
  store = Store;

  constructor(
    @Inject(DOCUMENT) private document,
    private cs: ContractsService,
    private router: Router,
  ) { }
  
  // https://stackoverflow.com/questions/48048299/angular-5-scroll-to-top-on-every-route-click
  onActivate(e) {
    window.scroll(0,0);

    // check account
    const routeName = e.constructor.name;
    console.log(routeName);
    if (['PostComponent', 'ReferComponent'].includes(routeName)) {
      this.checkAccount();
    }
  }
  
  async checkAccount() {
    try {
      if (!this.store.curUser) {
        this.store.curUser = await this.cs.getAccount();
      }
    } catch (err) {
      if(confirm('Couldn\'t get any accounts!Do you want to install Chrome MetaMask extention?')) {
        this.document.location.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      } else {
        this.router.navigateByUrl(`/noauth`)
      }
    }
  }
}

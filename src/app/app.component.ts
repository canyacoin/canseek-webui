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
  loading: boolean = false;
  store = Store;
  url: string = '';

  constructor(
    @Inject(DOCUMENT) private document,
    private cs: ContractsService,
    private router: Router,
  ) { }
  
  // https://stackoverflow.com/questions/48048299/angular-5-scroll-to-top-on-every-route-click
  onActivate() {
    window.scroll(0,0);

    // check account
    this.url = this.router.url;
    // path regexp: 1. post 2. refer/new/:id 3. applicants/:id
    if (/^\/post\?type=[new|edit]/.test(this.url) || /^\/refer\/new\//.test(this.url) || /^\/applicants\//.test(this.url)) {
      this.checkAccount();
    }
  }

  async checkAccount() {
    try {
      if (!this.store.curUser) {
        this.loading = true;
        this.store.curUser = await this.cs.getAccount();
        this.loading = false;
      }
    } catch (err) {
      this.loading = false;
      if(confirm('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly. Click OK button if you want to install Chrome MetaMask extention')) {
        this.document.location.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      } else {
        
        this.router.navigateByUrl(`/noauth`);
      }
    }
  }
}

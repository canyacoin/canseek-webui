import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Store } from "../../store";
import { GlobalService } from '../../services/global.service';
import { ContractsService } from '../../services/contracts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() url;
  @Input() curUser;
  @Input() balance;
  loading: boolean = false;
  store = Store;
  currency = Store.currency;

  searchText: string = '';

  constructor(
    @Inject(DOCUMENT) private document,
    private gs: GlobalService,
    private cs: ContractsService,
    private router: Router,

  ) { }

  async ngOnInit() {
    const currencyName = localStorage.getItem('currencyName') || 'CAN';
    this.setCurrency(this.currency[currencyName]);
  }

  async ngOnChanges({curUser, balance}) {
    const user = (curUser || {}).currentValue;
    const b = (balance || {}).currentValue;

    if (user) {
      this.store.balance = await this.cs.getCANBalance();
    }
    if (b) {
      this.balance = b;
    }
  }
  
  async buyCan() {
    try {
        this.loading = true;
        this.store.balance += await this.cs.buyCAN();
        this.loading = false;
    } catch (err) {
      if(confirm('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly. Click OK button if you want to install Chrome MetaMask extention')) {
        this.document.location.href = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      } else {
        this.loading = false;
      }
    }
  }

  setCurrency(currency) {
    const { name } = currency;
    const opts = {
      fsyms: `${name},CAN,ETH`,
      tsyms: Object.keys(this.currency).join(','),
    };

    localStorage.setItem('currencyName', name);
    this.store.selectedCurrency = currency;
    this.gs.changeCurrency(opts)
    .then(res => this.store.selectedCurrency['rate'] = res['CAN'][name]);
  }

  onSearch() {
    // setTimeout(() => {
    //   console.log('search');
    //   window.scroll(0,500);
    // }, 300);
    this.gs.change.emit(this.searchText);
  }
}

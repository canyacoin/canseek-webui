import { Component, OnInit } from '@angular/core';
import { Store } from "../../store";
import { CurrencyService } from '../../services/global/currency.service';
import { ContractsService } from '../../services/contracts/contracts.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  store = Store;
  currency = Store.currency;

  searchText: string = '';

  constructor(
    private cs: CurrencyService,
    private cons: ContractsService,
    private ps: PostService,
  ) { }

  ngOnInit() {
    const currencyName = localStorage.getItem('currencyName') || 'USD';
    this.setCurrency(this.currency[currencyName]);
    this.getAccount();
    this.getBalance();
  }

  async getAccount() {
    this.store.curUser = await this.cons.getAccount();
  }

  getBalance()  {
    this.cons.getCANBalance()
      .then(b => this.store.balance = b)
      .catch(err => {
        console.error(err);
      })
  }
  
  buyCan() {
    this.cons.buyCAN()
      .then(delta => this.store.balance += delta)
      .catch(err => console.error(err));
  }

  setCurrency(currency) {
    const { name } = currency;
    const opts = {
      fsyms: `${name},CAN,ETH`,
      tsyms: Object.keys(this.currency).join(','),
    };

    localStorage.setItem('currencyName', name);
    this.store.selectedCurrency = currency;
    this.cs.changeCurrency(opts)
    .then(res => this.store.selectedCurrency['rate'] = res['CAN'][name]);
  }

  onSearch() {
    this.ps.change.emit(this.searchText);
  }
}

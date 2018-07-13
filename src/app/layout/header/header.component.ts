import { Component, OnInit } from '@angular/core';
import { Store } from "../../store";
import { CurrencyService } from '../../services/global/currency.service';
import { ContractsService } from '../../services/contracts/contracts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  store = Store;
  currency = {
    AUD: {
        symbol: 'A$',
        name: 'AUD',
        string: 'A$ AUD',
        value: 0
    },
    USD: {
        symbol: '$',
        name: 'USD',
        string: '$ USD',
        value: 0
    },
    EUR: {
        symbol: '€',
        name: 'EUR',
        string: '€ EUR',
        value: 0
    },
  };

  selectedCurrency: any = {};

  constructor(
    private cs: CurrencyService,
    private cons: ContractsService,
  ) { }

  ngOnInit() {
    const currencyName = localStorage.getItem('currencyName') || 'USD';
    this.setCurrency(this.currency[currencyName]);
    this.getAccount();
  }

  async getAccount() {
    this.store.curUser = await this.cons.getAccount();
  }

  setCurrency(currency) {
    const { name } = currency;
    const opts = {
      fsyms: `${name},CAN,ETH`,
      tsyms: Object.keys(this.currency).join(','),
    };

    localStorage.setItem('currencyName', name);
    this.selectedCurrency = currency;
    this.cs.changeCurrency(opts)
    .then(res => this.store.exchangeRate = res);
  }

}

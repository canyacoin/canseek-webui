import { Component, OnInit } from '@angular/core';
import { Store } from "../../store";
import { ContractsService } from '../../services/contracts.service';
import { GlobalService } from '../../services/global.service';

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
    private cs: ContractsService,
    private gs: GlobalService,
  ) { }

  async ngOnInit() {
    // this.store.curUser = await this.cs.getAccount();

    const currencyName = localStorage.getItem('currencyName') || 'USD';
    this.setCurrency(this.currency[currencyName]);
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
    this.gs.change.emit(this.searchText);
  }
}

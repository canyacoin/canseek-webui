import { Component, OnInit, Input } from '@angular/core';
import { Store } from "../../store";
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() url;
  store = Store;
  currency = Store.currency;

  searchText: string = '';

  constructor(
    private gs: GlobalService,
  ) { }

  async ngOnInit() {
    const currencyName = localStorage.getItem('currencyName') || 'CAN';
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
    // setTimeout(() => {
    //   console.log('search');
    //   window.scroll(0,500);
    // }, 300);
    this.gs.change.emit(this.searchText);
  }
}

import { Component, OnInit } from '@angular/core';
import { Store } from '../../store';

@Component({
  selector: 'app-buycan',
  templateUrl: './buycan.component.html',
  styleUrls: ['./buycan.component.less']
})
export class BuycanComponent implements OnInit {
  store = Store;
  constructor() { }

  ngOnInit() {
  }

}

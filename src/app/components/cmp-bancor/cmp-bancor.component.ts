import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var BancorConvertWidget: any;

@Component({
  selector: 'app-cmp-bancor',
  templateUrl: './cmp-bancor.component.html',
  styleUrls: ['./cmp-bancor.component.less']
})
export class CmpBancorComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit() {
    BancorConvertWidget.init({
      'type': '1',
      'baseCurrencyId': '5a6f61ece3de16000123763a',
      'pairCurrencyId': '5937d635231e97001f744267',
      'primaryColor': '#00BFFF',
      'primaryColorHover': '55DAFB'
    });
  }
}

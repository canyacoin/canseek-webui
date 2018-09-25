import { Component, OnInit } from '@angular/core';
import { Store } from '@store';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-cmp-exchange',
  templateUrl: './cmp-exchange.component.html',
  styleUrls: ['./cmp-exchange.component.less']
})
export class CmpExchangeComponent implements OnInit {
  network = Store.displayNet[environment.network];
  exchanges = [
    {
      name: 'KuCoin',
      url: 'https://www.kucoin.com/#/trade.pro/CAN-BTC'
    },
    {
      name: 'xBrick',
      url: 'https://xbrick.io/',
    },
    {
      name: 'AEX',
      url: 'https://www.aex.com/'
    },
    {
      name: 'Cryptopia',
      url: 'https://www.cryptopia.co.nz/Exchange/?market=CAN_BTC'
    },
    {
      name: 'CoinSpot',
      url: 'https://www.coinspot.com.au/buy/can'
    },
    {
      name: 'EtherDelta',
      url: 'https://etherdelta.com/#0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0-ETH'
    },
    {
      name: 'Coss.io',
      url : 'https://exchange.coss.io/exchange/can-eth'
    },
    {
      name: 'Qryptos',
      url : 'https://trade.qryptos.com/basic/CANETH'
    },
    {
      name: 'Radar Relay',
      url : 'https://app.radarrelay.com/CAN/WETH'
    },
    {
      name: 'IDEX',
      url: 'https://idex.market/eth/can'
    },
    {
      name: 'Gatecoin',
      url : 'https://gatecoin.com/markets/caneth'
    },
    {
      name: 'Coinswitch',
      url : 'https://coinswitch.co/'
    },
    {
      name: 'IDAX',
      url : 'https://www.idax.mn/#/exchange?pairname=CAN_ETH'
    }
  ];

  containueUrl = '/';
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.containueUrl = params.containueUrl;
    });
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ContractsService } from '@service/contracts.service';
import { Store } from '@store';

declare let require: any;
declare let window: any;
const Web3 = require('web3');
@Component({
  selector: 'app-status-light',
  templateUrl: './status-light.component.html',
  styleUrls: ['./status-light.component.less']
})
export class StatusLightComponent implements OnInit, AfterViewInit {
  store = Store;
  private _web3;
  constructor(
    private cs: ContractsService
  ) {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
    }
  }
  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.store.curNet = await this.cs.getNet();
    this.store.curUser = await this.cs.getAccount();
    // await this.cs.buyCAN();
    this.store.balance = await this.cs.getCANBalance();
  }
  
  /* Get the current network type */ 
  public async getCurrentNetwork() {
    console.log('getting network....');
    if (this._web3) {
      const network = await this._web3.eth.net.getNetworkType();
      return network;
    } else {
      return 'null';
    }
  }
  get web3Message() {
    if (!this._web3) {
      return 'No wallet detected!';
    }
    else {
      switch (this.store.curNet !== '') {
        case this.store.curNet !== 'main' && this.store.curNet !== 'null':
          return 'Please connect to mainnet.';
        case this.store.curNet === 'main' && this.store.curUser === '':
          return 'Please unlock your wallet and refresh.';
        case this.store.curNet === 'main' && this.store.curUser !== '':
          return 'Connected to mainnet.';
      }
    }
  }
  get web3Color(): string {
    if (!this._web3) {
      return '#ff4954';
    }
    else {
      switch (this.store.curNet !== '') {
        case this.store.curNet !== 'main':
          return '#b7bbbd';
        case this.store.curNet === 'main' && this.store.curUser === '':
          return '#ff4954';
        case this.store.curNet === 'main' && this.store.curUser !== '':
          return '#30D7A9';
        default:
          return 'ff4954';
      }
    }
  }

}

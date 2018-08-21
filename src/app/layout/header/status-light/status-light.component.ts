import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ContractsService } from '../../../services/contracts.service';
import { Store } from '../../../store';

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
  
  canYaMainContract = '0x1d462414fe14cf489c7a21cac78509f4bf8cd7c0';
  constructor(private contractService: ContractsService) {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
    }
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getCurrentNetwork().then(network => {
      this.store.curNet = network;
      console.log(this.store.curNet);
    }); 
    this.contractService.getAccount().then(user=>{
      /**
       *  Get the CAN token amount from etherscan 
       *  In CANWork, we utilize CANPay to do this,
       *  however since CANPay has not been integrated to CANSeek,
       *  this means etherscan's API had to be used.
       *  
      */
      this.store.curUser = user;  //get the current user's address
      this.store.balance = this.getTokenBalanceAtAddress(this.store.curUser, this.canYaMainContract, 6); 
    })
  }
  /**
   *  A generic code to get token balances.
   * 
   */
  getTokenBalanceAtAddress(targetAddress, tokenAddress, precision){ 
    let etherscanApi = 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress='; //the API link.
    let etherscanApiCanYa = etherscanApi + tokenAddress; //change this value if you want to use other token.
    let canAtAddress = etherscanApiCanYa + '&address=' + targetAddress + '&tag=latest';  
    let result = Math.floor(this.getJSON(canAtAddress).result / (Math.pow(10, precision)));  // divide by 10 the power of the token's precision to get the actual, exact number of CAN you own.
    return result;
  }

  /** JSON Parser */
  getJSON(url) {
    var resp;
    var xmlHttp;
    resp = '';
    xmlHttp = new XMLHttpRequest();
    if (xmlHttp != null) {
      xmlHttp.open("GET", url, false);
      xmlHttp.send(null);
      resp = xmlHttp.responseText;
    }
    return JSON.parse(resp);
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

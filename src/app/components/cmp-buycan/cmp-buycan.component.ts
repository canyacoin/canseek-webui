import { Component, OnInit } from '@angular/core';
import { ContractsService } from '../../services/contracts.service';
import { Store } from "../../store";

@Component({
  selector: 'app-cmp-buycan',
  templateUrl: './cmp-buycan.component.html',
  styleUrls: ['./cmp-buycan.component.less']
})
export class CmpBuycanComponent implements OnInit {
  store = Store;
  constructor(
    private cs: ContractsService
  ) { }

  // ngOnInit() {
  async ngOnInit() {
    // this.store.curUser = await this.cs.getAccount();
    this.store.balance = await this.cs.getCANBalance();
    // this.getAccount();
    // this.getBalance();
  }

  // async getAccount() {
  //   this.store.curUser = await this.cs.getAccount();
  // }

  // getBalance()  {
  //   this.cs.getCANBalance()
  //     .then(b => this.store.balance = b)
  //     .catch(err => {
  //       console.error(err);
  //     })
  // }
  
  async buyCan() {
    this.store.balance += await this.cs.buyCAN();
    // this.cs.buyCAN()
    //   .then(delta => this.store.balance += delta)
    //   .catch(err => console.error(err));
  }

}

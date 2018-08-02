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

  async ngOnInit() {
    this.store.balance = await this.cs.getCANBalance();
  }
  
  async buyCan() {
    this.store.balance += await this.cs.buyCAN();
  }

}

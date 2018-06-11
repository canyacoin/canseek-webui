import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractsService } from '../services/contracts/contracts.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  balance: number = 0;
  
  currentUser: any = JSON.parse( localStorage.getItem('credentials') );

  constructor(
    private router: Router,
    private cs: ContractsService
  ) { }

  ngOnInit() {
    this.getBalance();
  }

  getBalance()  {
    this.cs.getCANBalance()
      .then(b => this.balance = b)
      .catch(err => console.error(err))
  }

  buyCan() {
    this.cs.buyCAN()
      .then(delta => this.balance += delta)
      .catch(err => console.error(err));
  }
}

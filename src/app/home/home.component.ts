import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {ContractsService} from '../services/contracts/contracts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit, AfterViewInit {

  // Current user?
  currentUser: any = JSON.parse( localStorage.getItem('credentials') );

  // Posts
  posts = [
    { postId: 0, status: 'Open', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 1, status: 'Open', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 2, status: 'Open', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 3, status: 'Closed', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 4, status: 'Closed', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 5, status: 'Closed', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 6, status: 'Closed', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 7, status: 'Cancelled', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 8, status: 'Cancelled', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 9, status: 'Cancelled', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'},
    { postId: 10, status: 'Cancelled', title: 'Developer', ownerAddress: '0x0', ownerName: 'CanYa', bounty: 1000, cost: 50, honeypot: 1000, details: 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.'}
  ];

  // Flags
  loading = true;

  constructor(private router: Router,
    private activatedRoute:  ActivatedRoute,
    private cs: ContractsService) {
  }

  async ngOnInit() {
    // await this.cs.buyCAN('10');
    // await this.cs.addPost(1000, 1);
    const canBalance = await this.cs.getCANBalance();
    console.log(canBalance);
    const postId = await this.cs.addPost(1000, 10);
    console.log(postId);
    const newCanBalance = await this.cs.getCANBalance();
    console.log(newCanBalance);
    setTimeout( () => {
      this.loading = false;
    }, 2000 );
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe( (params) => {
      // PARAM? = params['query'] ? params['query'] : '';
    });
  }
}

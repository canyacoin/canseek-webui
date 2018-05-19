import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-postcard',
  templateUrl: './postcard.component.html',
  styleUrls: ['./postcard.component.new.css']
})
export class PostcardComponent implements OnInit {

  public postId: number;
  public status: string;
  public title: string;
  public ownerAddress: string;
  public ownerName: string;
  public bounty: number;
  public cost: number;
  public honeypot: number;
  public summary: string;
  public details: string;

  @Input() post;
  public postDetail;

  constructor() {
    // this.status = 'Open';
    // // this.status = 'Closed';
    // this.title = 'Solidity Developer';
    // this.ownerName = 'CanYa';
    // this.cost = 100;
    // this.honeypot = 2000;
    // this.details = 'Full-stack solidity developer needed. Familiar with Angular, Firebase, Solidity, Truffle.';
  }

  ngOnInit() {
    this.postId = this.post.postId;
    this.status = this.post.status;
    this.title = this.post.title;
    this.ownerAddress = this.post.ownerAddress;
    this.ownerName = this.post.ownerName;
    this.bounty = this.post.bounty;
    this.cost = this.post.cost;
    this.honeypot = this.post.honeypot;
    this.summary = this.post.summary;
    this.details = this.post.details;
  }

  getStatus() {
    return 'postCancelled';
  }

  isActive() {
    return this.status === 'Open' ? true : false;
  }

}

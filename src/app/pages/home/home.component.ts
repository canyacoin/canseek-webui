import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { ContractsService } from '../../services/contracts/contracts.service';

// import { Store } from '../../store';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  moment = moment;
  curUser: string;
  loading: boolean = true;
  posts: any;
  results: any;

  statusValue='all';
  balance: number = 0;
  // posts=Store.posts;
  // results=[];
  
  constructor(
    private ps: PostService,
    private cs: ContractsService,
  ) { }

  ngOnInit() {
    this.getAccount();
    this.getPosts();
    this.getBalance();
  }
  async getAccount() {
    this.curUser = await this.cs.getAccount();
  }
  getBalance() {
    this.cs.getCANBalance()
      .then(b => this.balance = b);
  }

  getPosts(): void {
    this.ps.getPosts()
      .subscribe(posts => {
        this.posts = posts
        this.loading = false;
        this.searchStatus();
      });
  }
  searchStatus() {
    const { posts, statusValue } = this;
    let next;

    switch(statusValue) {
      case 'all':
        next = posts; break;
      case 'open':
      case 'closed':
      case 'expired':
        next = posts
        .filter(item => item.status === statusValue)
        .sort((a, b) => b.time - a.time);
        break;
      case 'my_posts':
        next = posts.filter(item => item.ownerAddr === this.curUser)
        .sort((a, b) => b.time - a.time);
        break;
      case 'my_referrals':
        next = posts.filter(item => item.recommenders[this.curUser])
        .sort((a, b) => b.time - a.time);
        break;
    }
    this.results = next;
  }
}

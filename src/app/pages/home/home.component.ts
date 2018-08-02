import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { ContractsService } from '../../services/contracts.service';
import { Store } from "../../store";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  store = Store;
  loading: boolean = true;
  posts: any;
  results: any;

  statusValue = localStorage.getItem('statusValue') || 'all';
  balance: number = 0;
  
  constructor(
    private gs: GlobalService,
    private cs: ContractsService,
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  async getAccount() {
    try {
      if (!this.store.curUser) {
        this.loading = true;
        this.store.curUser = await this.cs.getAccount();
        this.loading = false;
      }
    } catch (err) {
      alert(err.message);
    }
  }

  getPosts(): void {
    this.gs.getPosts()
      .subscribe(posts => {
        this.posts = posts
        this.loading = false;
        this.searchStatus();
      });
  }

  async searchStatus() {
    const { posts, statusValue } = this;
    let next;

    localStorage.setItem('statusValue', statusValue);
    switch(statusValue) {
      case 'all':
        next = next = posts
        .filter(item => item.status)
        .sort((a, b) => b.time - a.time); 
        break;
      case 'open':
      case 'pending':
      case 'closed':
      case 'cancelled':
        next = posts
        .filter(item => item.status === statusValue)
        .sort((a, b) => b.time - a.time);
        break;
      case 'my posts':
        this.results = [];
        await this.getAccount();
        
        next = posts.filter(item => item.status && item.owner_addr === this.store.curUser)
        .sort((a, b) => b.time - a.time);
        break;
      case 'my referrals':
        this.results = [];
        await this.getAccount();

        next = posts.filter(item => item.status && item['referrals_by_user'][this.store.curUser])
        .sort((a, b) => b.time - a.time);
        break;
    }
    
    this.results = next;
    this.onHomeSearch(next, posts);
  }
  onHomeSearch(next, posts) {
    this.gs.change.subscribe((s: string) => {
      if (s) {
        this.results = posts.filter(post => (
          (post.job_title || '').includes(s)
          ||
          (post.company_name || '').includes(s)
        ))
      } else {
        this.results = next;
      }
    })
  }
}

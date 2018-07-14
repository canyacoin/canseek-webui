import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Store } from "../../store";
import * as moment from 'moment';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  store = Store;
  moment = moment;
  loading: boolean = true;
  posts: any;
  results: any;

  statusValue = localStorage.getItem('statusValue') || 'all';
  balance: number = 0;
  confirmModal: NzModalRef;
  
  constructor(
    private ps: PostService,
    private modal: NzModalService,
    private message: NzMessageService,
    // private cs: ContractsService,
  ) { }

  ngOnInit() {
    this.getPosts();
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
    const { curUser } = this.store;
    let next;

    localStorage.setItem('statusValue', statusValue);
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
        next = posts.filter(item => item.owner_addr === curUser)
        .sort((a, b) => b.time - a.time);
        break;
      case 'my_referrals':
        next = posts.filter(item => (item.recommenders || {})[curUser])
        .sort((a, b) => b.time - a.time);
        break;
    }
    this.results = next;
  }
  
  showConfirm(id): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to delete this job post?',
      nzOnOk: () => 
      this.ps.deletePost(id)
        .then(() => this.message.create('success', 'Delete success'))
        .catch(() => this.message.create('error', 'Oops error'))
    });
  }
}
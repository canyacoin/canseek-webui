import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

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

  radioValue='A';
  // posts=Store.posts;
  // results=[];
  
  constructor(
    private ps: PostService,
  ) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.ps.getPosts()
      .subscribe(posts => {
        this.posts = posts
        this.loading = false;
        // this.searchStatus();
      });
  }

}

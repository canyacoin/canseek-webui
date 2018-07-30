import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Store } from "../../store";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.less']
})
export class PostDetailComponent implements OnInit {
  post: Object;
  store = Store;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.ps.getPost(id)
      .subscribe(post => this.post = post);
  }

  updatePostStatus(post) {
    this.loading = true;
    this.ps.updatePostStatus(post)
      .then(status => {
        this.loading = false;
        this.message.success('updated');
      })
      .catch(err => {
        this.loading = false;
        this.message.error(err);
      })
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { Store } from "../../store";
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

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
    private gs: GlobalService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.gs.getPost(id)
      .subscribe(post => {
        if (!post) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.post = post;
      })
  }

  updatePostStatus(post) {
    this.loading = true;
    this.gs.updatePendingPost(post)
      .then(() => {
        this.loading = false;
        this.message.success('updated');
      })
      .catch(err => {
        this.loading = false;
        this.message.error(err.message);console.log(err);;
      })
  }

}

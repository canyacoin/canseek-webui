import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.less']
})
export class StatusComponent implements OnInit {
  pid: string;
  cid: string;
  type: string;
  host: string;
  post: any;
  candidate: any;
  copied: boolean = false;
  loading: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private ps: PostService,
    @Inject(DOCUMENT) private document,
    private message: NzMessageService,
  ) { 
    this.route.queryParams.subscribe(params => {
      const { type, pid, cid } = params;

      this.type = type;
      this.pid = pid;
      this.cid = cid;
      this.host = this.document.location.origin;
    })

  }

  ngOnInit() {
    this.ps.getPost(this.pid).subscribe(post => this.post = post);
    
    if (this.cid) {
      this.ps.getCandidate(this.pid, this.cid).subscribe(candidate => this.candidate = candidate)
    }
  }

  updateStatus(post) {
    this.loading = true;

    this.ps.updatePostStatus(post)
      .then(status => this.loading = false)
      .catch(err => {
        this.message.error(err)
        console.log(err);
      })
  }

  copy() {
    this.copied = !this.copied;
  }
}

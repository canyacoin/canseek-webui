import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { GlobalService } from '../../services/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

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
    private gs: GlobalService,
    @Inject(DOCUMENT) private document,
    private message: NzMessageService,
    private router: Router,
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
    this.gs.getPost(this.pid).subscribe(post => {
      if (!post) {
        this.router.navigateByUrl(`/pagenotfound`);
      }
      this.post = post;
    });
    
    if (this.cid) {
      this.gs.getCandidate(this.pid, this.cid).subscribe(candidate => {
        if (!candidate) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.candidate = candidate;
      })
    }
  }

  updateStatus(post) {
    this.loading = true;

    this.gs.updatePendingPost(post)
      .then(() => this.loading = false)
      .catch(err => {
        this.loading = false;
        this.message.error(err.message);console.log(err);;
      })
  }

  updateCandidateStatus(post, candidate) {
    this.loading = true;

    this.gs.updateCandidateStatus(post, candidate)
      .then(() => this.loading = false)
      .catch(err => {
        this.loading = false;
        this.message.error(err.message);console.log(err);;
      })
  }

  copy() {
    this.copied = !this.copied;
  }
}

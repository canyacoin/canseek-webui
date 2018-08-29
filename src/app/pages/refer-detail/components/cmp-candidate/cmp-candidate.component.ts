import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '@service/global.service';
import { Store } from '@store';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cmp-candidate',
  templateUrl: './cmp-candidate.component.html',
  styleUrls: ['./cmp-candidate.component.less']
})
export class CmpCandidateComponent implements OnInit {
  @Input() pid: string;
  @Input() cid: string;
  @Input() list: boolean;
  store = Store;
  candidate: any;
  post: any;
  loading: boolean = false;
  
  constructor(
    private gs: GlobalService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCandidate();
    this.getPost();
  }

  getCandidate(): void {
    this.gs.getCandidate(this.pid, this.cid)
      .subscribe(candidate => {
        if (!candidate) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.candidate = candidate;
      })
  }

  getPost(): void {
    this.gs.getPost(this.pid)
      .subscribe(post => {
        if (!post) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.post = post;
      });
  }

  updateCandidateStatus(post, candidate) {
    this.loading = true;

    this.gs.updatePendingCandidate(post, candidate)
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

import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Store } from '../../../../store';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-cmp-candidate',
  templateUrl: './cmp-candidate.component.html',
  styleUrls: ['./cmp-candidate.component.less']
})
export class CmpCandidateComponent implements OnInit {
  @Input() pid: string;
  @Input() cid: string;
  store = Store;
  candidate: any;
  post: any;
  loading: boolean = false;
  
  constructor(
    private ps: PostService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
    this.getCandidate();
    this.getPost();
  }

  getCandidate(): void {
    this.ps.getCandidate(this.pid, this.cid)
      .subscribe(candidate => this.candidate = candidate)
  }

  getPost(): void {
    this.ps.getPost(this.pid)
      .subscribe(post => this.post = post);
  }

  updateCandidateStatus(post, candidate) {
    this.loading = true;

    this.ps.updateCandidateStatus(post, candidate)
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

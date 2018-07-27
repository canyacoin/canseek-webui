import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { Store } from '../../../../store';

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
  
  constructor(
    private ps: PostService,
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

}

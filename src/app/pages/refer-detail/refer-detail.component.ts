import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-refer-detail',
  templateUrl: './refer-detail.component.html',
  styleUrls: ['./refer-detail.component.less']
})
export class ReferDetailComponent implements OnInit {
  @Input() candidate: Object;
  post: any;

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,

  ) { }

  ngOnInit() {
    this.getCandidate();
    this.getPost();
  }

  getCandidate(): void {
    const { pid, cid } = this.route.snapshot.params;
    this.ps.getCandidate(pid, cid)
      .subscribe(candidate => this.candidate = candidate)
  }

  getPost(): void {
    const { pid } = this.route.snapshot.params;

    this.ps.getPost(pid)
      .subscribe(post => this.post = post);
  }
}

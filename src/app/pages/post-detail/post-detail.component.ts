import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.less']
})
export class PostDetailComponent implements OnInit {
  @Input() post: Object;

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.ps.getPost(id)
      .subscribe(post => this.post = post);
  }

}
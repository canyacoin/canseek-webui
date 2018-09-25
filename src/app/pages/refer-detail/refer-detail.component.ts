import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-refer-detail',
  templateUrl: './refer-detail.component.html',
  styleUrls: ['./refer-detail.component.less']
})
export class ReferDetailComponent implements OnInit {
  pid: string;
  cid: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    const { pid, cid } = this.route.snapshot.params;
    this.pid = pid;
    this.cid = cid;
  }

  ngOnInit() {
  }
}

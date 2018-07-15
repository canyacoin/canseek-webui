import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';

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
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document
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
  }

}

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
  id: string;
  type: string;
  host: string;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document
  ) { 
    const { type, id } = this.route.snapshot.params;
    this.type = type;
    this.id = id;
    this.host = this.document.location.origin;
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.less']
})
export class StatusComponent implements OnInit {
  id: string;
  type: string;
  
  constructor(
    private route: ActivatedRoute,
  ) { 
    const { type, id } = this.route.snapshot.params;
    this.type = type;
    this.id = id;
  }

  ngOnInit() {
  }

}

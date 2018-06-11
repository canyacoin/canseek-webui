import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {
  @Input() c: any;
  @Input() d: any;
  
  constructor() { }

  ngOnInit() {
  }

}

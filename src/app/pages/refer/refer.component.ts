import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.less']
})
export class ReferComponent implements OnInit {
  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    // this.changeContent();
  }

  next(): void {
    this.current += 1;
    // this.changeContent();
  }

  done(): void {
    console.log('done');
  }
  constructor() { }

  ngOnInit() {
  }

}

/**
 * TODO:
 * 1. timezone list is too long, render it takes a lot time
 * 1. can't search country, eg: china
 */ 

import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { GlobalService } from '@service/global.service';

@Component({
  selector: 'app-cmp-timezone',
  templateUrl: './cmp-timezone.component.html',
  styleUrls: ['./cmp-timezone.component.less']
})
export class CmpTimezoneComponent implements OnInit, AfterViewInit {
  @Input() location;
  @Input() type;
  @Output() onChangeValue:EventEmitter<string> = new EventEmitter();
  @Output() onChangeType:EventEmitter<boolean> = new EventEmitter();

  timezones = localStorage.getItem('timezones') ? JSON.parse(localStorage.getItem('timezones')) : [];
  UTCs = localStorage.getItem('UTCs') ? JSON.parse(localStorage.getItem('UTCs')) : [];

  innerLocation: string;

  constructor(
    private gs: GlobalService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.timezones.length) {
      this.getTimeZone();
    }
    if (!this.UTCs.length) {
      this.genUTCs();
    }
  }

  async getTimeZone() {
    const { countries } = await this.gs.getTimeZone();
    this.timezones = Object.keys(countries).map(c => {
      const item = countries[c];
      return {country: item.name, zones: item.zones};
    });
    localStorage.setItem('timezones', JSON.stringify(this.timezones));
  }

  genUTCs() {
    const UTCs = Array.from(new Array(25), (x,i) => {
      let number = i - 12;
      let symbol = ((number > 0) && number != 0 ? '+' : '-');
      let format = ('0' + Math.abs(number)).slice(-2);
      return `UTC ${symbol}${format}:00`;
    });
    this.UTCs = UTCs;
    localStorage.setItem('UTCs', JSON.stringify(UTCs));
  }

  onLocationChange(location) {
    this.onChangeValue.emit(location);
  }

  onTypeChange(type) {
    this.innerLocation = undefined;
    this.onChangeValue.emit(undefined);
    this.onChangeType.emit(type);
  }
}

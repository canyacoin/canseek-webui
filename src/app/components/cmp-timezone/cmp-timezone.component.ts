/**
 * TODO:
 * 1. timezone list is too long, render it takes a lot time
 * 1. can't search country, eg: china
 */

import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnChanges } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-cmp-timezone',
  templateUrl: './cmp-timezone.component.html',
  styleUrls: ['./cmp-timezone.component.less']
})
export class CmpTimezoneComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() location;
  @Input() type;
  @Output() onChangeValue: EventEmitter<string> = new EventEmitter();
  @Output() onChangeType: EventEmitter<boolean> = new EventEmitter();

  timezones = localStorage.getItem('timezones') ? JSON.parse(localStorage.getItem('timezones')) : [];
  UTCs = localStorage.getItem('UTCs') ? JSON.parse(localStorage.getItem('UTCs')) : [];

  innerLocation: string;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.timezones.length) {
      this.getTimeZone();
    }
    if (!this.UTCs.length) {
      this.genUTCs();
    }
  }

  ngOnChanges(obj) {
    this.innerLocation = obj.location.currentValue;
  }

  async getTimeZone() {
    const list = moment.tz.names();
    this.timezones = list
      .filter(tz => tz.indexOf('/') > 0)
      .filter(tz => moment.tz(tz).format().slice(-1) !== 'Z')
      .map(tz => {
        const UTCOffset = moment.tz(tz).format().slice(-6);
        return tz.replace(/\//g, ', ') + ' UTC ' + UTCOffset;
      });
    localStorage.setItem('timezones', JSON.stringify(this.timezones));
  }

  genUTCs() {
    const UTCs = Array.from(new Array(25), (x, i) => {
      const number = i - 12;
      const symbol = ((number > 0) && number !== 0 ? '+' : '-');
      const format = ('0' + Math.abs(number)).slice(-2);
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

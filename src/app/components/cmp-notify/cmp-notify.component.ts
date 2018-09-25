import { Component, OnInit } from '@angular/core';
import { NotifyService } from '@service/notify.service';
import { Notify } from '@class/notify';
import { Store } from '@store';
import * as moment from 'moment';

@Component({
  selector: 'app-cmp-notify',
  templateUrl: './cmp-notify.component.html',
  styleUrls: ['./cmp-notify.component.less']
})
export class CmpNotifyComponent implements OnInit {
  notifications: Notify[];
  store = Store;
  moment = moment;

  constructor(
    private ns: NotifyService,
  ) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.ns
      .getUnreadNotifications(this.store.curUser)
      .subscribe(list => {
        this.notifications = (list || []);
      });
  }

  readAll() {
    this.ns.readAll(this.store.curUser);
  }
}

import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { environment } from '../../../environments/environment';
import { NotifyService } from '../../services/notify.service';
import { Notify } from '../../models/notify';
import { Store } from '../../store';

@Component({
  selector: 'app-cmp-notify',
  templateUrl: './cmp-notify.component.html',
  styleUrls: ['./cmp-notify.component.less']
})
export class CmpNotifyComponent implements OnInit {
  notifications: Notify[];
  // etherscanBaseUrl = environment.etherscanBaseUrl;
  store = Store;

  constructor(
    private ns: NotifyService,
  ) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications() {
    this.ns
      .getNotifications(this.store.curUser)
      .subscribe(list => {
        this.notifications = (list || []);
      });
  }
}
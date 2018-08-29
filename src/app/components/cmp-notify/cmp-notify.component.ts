import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../../environments/environment';
import { Notify } from '../../models/notify';
import { Store } from '../../store';

@Component({
  selector: 'app-cmp-notify',
  templateUrl: './cmp-notify.component.html',
  styleUrls: ['./cmp-notify.component.less']
})
export class CmpNotifyComponent implements OnInit {
  notifications: Notify[];
  etherscanBaseUrl = environment.etherscanBaseUrl;
  store = Store;

  constructor(
    private db: AngularFirestore,
  ) { 
  }

  ngOnInit() {
    this.getNotifications();
  }

  async getNotifications() {
    this.db
      .collection<Notify>('notifications', 
        ref => ref
          .where('user', '==', this.store.curUser.toLowerCase())
          .orderBy('time', 'desc')
      )
      .valueChanges()
      .subscribe(list => {
        this.notifications = (list || []);
      });
  }
}
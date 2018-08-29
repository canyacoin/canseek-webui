import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../../environments/environment';
import { Notify } from '../../models/notify';

@Component({
  selector: 'app-cmp-notify-detail',
  templateUrl: './cmp-notify-detail.component.html',
  styleUrls: ['./cmp-notify-detail.component.less']
})
export class CmpNotifyDetailComponent implements OnInit {
  loading: boolean = true;
  notification: Notify;
  etherscanBaseUrl = environment.etherscanBaseUrl;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getNotification();
  }

  async getNotification() {
    const { id } = this.route.snapshot.params;

    this.db
      .collection('notifications')
      .doc<Notify>(id)
      .valueChanges()
      .subscribe(notification => {
        if (!notification) this.router.navigateByUrl(`/pagenotfound`);
        this.notification = notification;
        this.loading = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from '../../../environments/environment';
import { ContractsService } from '../../services/contracts.service';
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
    private router: Router,
    private cs: ContractsService,
  ) { 
  }

  ngOnInit() {
    this.getLits();
  }

  async getLits() {
    try {
      this.store.curUser = await this.cs.getAccount();
      this.db.collection<Notify>('notifications', 
        ref => ref.where('user', '==', this.store.curUser.toLowerCase())
        .orderBy('time', 'desc')
      )
      .valueChanges()
      .subscribe(list => {
        this.notifications = (list || []);
      });
    } catch(err) {
      this.router.navigateByUrl(`/noauth`);
    }
  }
}
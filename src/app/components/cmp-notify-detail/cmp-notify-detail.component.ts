import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Notify } from '@class/notify';
import { NotifyService } from '@service/notify.service';

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
    private ns: NotifyService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getNotification();
  }

  async getNotification() {
    const { id } = this.route.snapshot.params;

    this.ns.getNotification(id)
      .subscribe(notification => {
        if (!notification) this.router.navigateByUrl(`/pagenotfound`);
        
        this.notification = notification;
        this.loading = false;
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Notify } from '@class/notify';
import { NotifyService } from '@service/notify.service';
import { GlobalService } from '@service/global.service';

@Component({
  selector: 'app-cmp-notify-detail',
  templateUrl: './cmp-notify-detail.component.html',
  styleUrls: ['./cmp-notify-detail.component.less']
})
export class CmpNotifyDetailComponent implements OnInit {
  loading = true;
  notification: Notify;
  etherscanBaseUrl = environment.etherscanBaseUrl;
  post: any;

  constructor(
    private ns: NotifyService,
    private router: Router,
    private route: ActivatedRoute,
    private gs: GlobalService,
  ) { }

  ngOnInit() {
    this.getNotification();
  }

  async getNotification() {
    const { id } = this.route.snapshot.params;

    this.ns.read(id);
    this.ns.getNotification(id)
      .subscribe(notification => {
        if (!notification) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.notification = notification;
        this.getPost();
        this.loading = false;
      });
  }

  getPost(): void {
    this.gs.getPost(this.notification.pid)
      .subscribe(post => {
        if (!post) {
          this.router.navigateByUrl(`/pagenotfound`);
        }
        this.post = post;
      });
  }
}

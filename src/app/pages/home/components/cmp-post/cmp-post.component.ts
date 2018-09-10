import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '@service/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Notify} from '@class/notify';
import { NotifyService } from '@service/notify.service';
import { Store } from "../../../../store";
import * as moment from 'moment';
import { ContractsService } from '@service/contracts.service';

@Component({
  selector: 'app-cmp-post',
  templateUrl: './cmp-post.component.html',
  styleUrls: ['./cmp-post.component.less']
})
export class CmpPostComponent implements OnInit {
  @Input() post: any;
  @Input() statusValue: string;
  @Input() cid: string;
  @Input() curUser: string;
  
  store = Store;
  
  moment = moment;
  loading: boolean = false;
  refundLoading: boolean = false;
  txHash: string;

  constructor(
    private gs: GlobalService,
    private message: NzMessageService,
    private cs: ContractsService,
    private ns: NotifyService,
  ) { }

  ngOnInit() {
    // console.log(this.post);
  }

  async cancel(post) {
    try {
      await this.gs.cancelPostDb(post);
      await this.gs.cancelPostPre(post);
      const result = await this.gs.cancelPost(post);
      this.txHash = (result || {})['tx'];
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
  }

  async onComplete() {
    // notify every candidate to getrefund
    if (this.post) {
      const pid = this.post['id'];
      const that = this;

      this.gs.getCandidates(pid)
      .subscribe(candidates => {
        (candidates || [])
        .filter(c => c.status !== 'pending')
        .map(candidate => {
          const { id: cid, owner_addr } = candidate;
          const notify: Notify = {
            id: '',
            pid: pid,
            cid: cid,
            hash: that.txHash,
            is_read: false,
            payment_type: '',
            action_type:'cancel',
            time: + new Date,
            user: owner_addr.toLowerCase(),
          };
          that.ns.notify(notify);
        })
      });
    }
    
    this.store.balance = await this.cs.getCANBalance();
  }

  cancelPost(post): void {
    post.nextStatus = 'cancelled';

    this.cs.canpayInstance(
      {
        amount: Math.ceil(post['reward'] * .01),
        postAuthorisationProcessName: 'Cancelling Fees',
        successText: 'Your job has been cancelled!',
      },
      this.cancel.bind(this, post),
      this.onComplete.bind(this),
    );
  }

  async getRefund(post) {
    this.refundLoading = true;
    await this.gs.getRefund(post, this.curUser);
    this.refundLoading = false;
    this.message.success('Get Refund Successfully !')
    this.store.balance = await this.cs.getCANBalance();
  }

  updatePostStatus(post) {
    this.loading = true;
    this.gs.updatePendingPost(post)
      .then(status => {
        this.loading = false;
        this.message.success('updated');
      })
      .catch(err => {
        this.loading = false;
        this.message.error(err.message);console.log(err);;
      })
  }
}

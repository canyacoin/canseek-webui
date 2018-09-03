import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '@service/global.service';
import { NzMessageService } from 'ng-zorro-antd';
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

  constructor(
    private gs: GlobalService,
    private message: NzMessageService,
    private cs: ContractsService,
  ) { }

  ngOnInit() {
    // console.log(this.post);
  }

  async cancel(post) {
    try {
      await this.gs.cancelPostDb(post);
      await this.gs.cancelPostPre(post);
      await this.gs.cancelPost(post);
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
  }

  async onComplete() {
    // this.statusValue = 'cancelled';
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

import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../../services/global.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Store } from "../../../../store";
import * as moment from 'moment';
import { ContractsService } from '../../../../services/contracts.service';

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
    this.message.success('Success');
    this.store.balance = await this.cs.getCANBalance();
  }

  cancelPost(post): void {
    post.nextStatus = 'cancelled';

    this.cs.canpayInstance(
      {
        amount: Math.ceil(post['reward'] * .1),
        postAuthorisationProcessName: 'Cancelling Post',
      },
      this.cancel.bind(this, post),
      this.onComplete.bind(this),
    );
  }

  getRefund(post) {
    this.refundLoading = true;
    const referNum = (post.referrals_by_user[this.curUser] || []).length;

    this.cs.canpayInstance(
      {
        dAppName: 'Yourself',
        amount: Math.ceil(post['cost'] * referNum),
        postAuthorisationProcessName: 'Getting Refund',
      },
      this.refund.bind(this, post),
      this.onComplete.bind(this),
    );
    this.refundLoading = false;
  }

  async refund(post) {
    try {
      await this.gs.getRefund(post, this.curUser);
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
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

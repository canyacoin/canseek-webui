import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../../services/global.service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
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
  confirmModal: NzModalRef;
  loading: boolean = false;

  constructor(
    private gs: GlobalService,
    private modal: NzModalService,
    private message: NzMessageService,
    private cs: ContractsService,
  ) { }

  ngOnInit() {
    // console.log(this.post);
  }

  showConfirm(post): void {
    post.nextStatus = 'cancelled'
    
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Confirmation required',
      nzContent: '<p class="text">Are your sure you want to cancel this job post?<br>This action cannot be reversed.</p><p class="">Fees: the initial reward will be refunded to the metamask address used to create the job post,less the 1% administration fee.<br>Any application fees will be refunded to participants.</p>',
      nzOkText: 'cancel',
      nzCancelText: 'back',
      nzOnOk: async () => {
        try {
          await this.gs.cancelPostDb(post);
          await this.gs.cancelPost(post);
          this.message.success('Cancel success');
          this.store.balance = await this.cs.getCANBalance();
        } catch (err) {
          this.message.error(err.message);console.log(err);
        }
      }
    });
  }

  async getRefund(post) {
    await this.gs.getRefund(post, this.curUser);
    this.store.balance = await this.cs.getCANBalance();
  }

  updatePostStatus(post) {
    this.loading = true;
    this.gs.updatePostStatus(post)
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

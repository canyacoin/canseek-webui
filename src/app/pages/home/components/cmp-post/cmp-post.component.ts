import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../../services/global.service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Store } from "../../../../store";
import * as moment from 'moment';

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
  ) { }

  ngOnInit() {
  }

  showConfirm(post): void {
    post.nextStatus = 'cancelled'
    
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to cancel this job post?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.gs.cancelPostDb(post)
          .then(() => this.gs.cancelPost(post))
          .then(() => this.message.success('Cancel success'))
          .catch(err => {
            this.message.error(err.message);
            console.log(err);
          })
    });
  }

  getRefund(post) {
    this.gs.getRefund(post, this.curUser);
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
        this.message.error(err.message);
        console.log(err);
      })
  }
}

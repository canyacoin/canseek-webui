import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../../../services/post.service';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
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
  
  moment = moment;
  confirmModal: NzModalRef;

  constructor(
    private ps: PostService,
    private modal: NzModalService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  showConfirm(post): void {
    post.nextStatus = 'cancelled'
    
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to cancel this job post?',
      nzOnOk: () => 
      this.ps.cancelPost(post)
        .then(() => this.message.create('success', 'Cancel success'))
        .catch(() => this.message.create('error', 'Oops error'))
    });
  }

  getRefund(e, post) {
    e.preventDefault();
    e.stopPropagation();
    this.ps.getRefund(post, this.curUser);
  }
}

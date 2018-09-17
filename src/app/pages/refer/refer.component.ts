import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CmpReferstep2Component } from './components/cmp-referstep2/cmp-referstep2.component';
import { GlobalService } from '@service/global.service';
import { ProfileService } from '@service/profile.service';
import { Notify} from '@class/notify';
import { NotifyService } from '@service/notify.service';
import { ContractsService } from '@service/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from "../../store";
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.less']
})
export class ReferComponent implements AfterViewInit {
  confirmModal: NzModalRef;
  @ViewChild(CmpReferstep2Component)
  private step2: CmpReferstep2Component;

  current = 0;
  validateForm: FormGroup;
  values: Object = {};

  store = Store;
  post: Object = {};

  doneLoading: boolean = false;
  loading: boolean = false;

  pid: string = '';
  cid: string = '';

  txHash: string = '';
  
  constructor(
    private fb: FormBuilder,
    private gs: GlobalService,
    private ps: ProfileService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private ns: NotifyService,
    private modal: NzModalService,
  ) {
    this.values = this.ps.getProfile();
    this.validateForm = this.fb.group({
      your_name: [ this.values['your_name'], [ Validators.required ] ],
      your_email: [ this.values['your_email'], [ Validators.required, Validators.email ] ],
      relation: [ null, [ Validators.required ] ],
      owner_addr: [ { value: this.store.curUser, disabled: true } ],
    });
    this.getPost();
  }

  ngAfterViewInit() {
  }

  submitForm(): any {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      this.values[i] = this.validateForm.controls[ i ].value;
    }
    return {
      valid: this.validateForm.valid,
      data: this.values,
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 0) {
      formData = this.submitForm();
      const isVerified = (this.store.authState['email'] == formData.data['your_email']) && this.store.authState['emailVerified'];

      if (!isVerified) {
        formData.valid = false;
        this.confirmModal = this.modal['error']({
          nzTitle: 'Please verify your email first!',
          nzOkText: 'OK',
        });
      } else {
        this.ps.setProfile(formData.data);
      }
    } else if (this.current === 1) {
      formData = this.step2.submitForm();
      this.values = {...this.values, ...formData.data};
    }
    
    if (formData.valid) {
      this.current += 1;
      window.scroll(0,0);
    }
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.gs.getPost(id)
      .subscribe(post => {
        this.post = post;
        // identify
        if (post['owner_addr'] === this.store.curUser) {
          this.router.navigateByUrl('/noauth');
        }
      });
  }

  redireact(id) {
    this.router.navigateByUrl(`/status?type=refer&pid=${this.post['id']}&cid=${id}`)
  }

  clearFile(list) {
    if (!list || !list.length) return;

    return list.map(li => {
      const { name, status, uid, response = {} } = li;
      return { name, status, uid, url: response.url };
    })
  }

  genCandidateData() {
    const CandidateData = {...this.values, status: 'pending', nextStatus: 'open', time: Date.now() };

    CandidateData['resume'] = this.clearFile(CandidateData['resume']);
    CandidateData['cover_letter'] = this.clearFile(CandidateData['cover_letter'])
  
    return JSON.parse(JSON.stringify(CandidateData));
  }

  async done() {
    this.doneLoading = true;

    const candidateData = this.genCandidateData();
    const { id } = candidateData;

    try {
      if (!id) {
        this.values['id'] = candidateData['id'] = this.cid = await this.gs.addCandidateDb(this.post, candidateData);
      }
      this.pid = this.post['id'];

      this.cs.canpayInstance(
        {
          amount: this.post['cost'],
          postAuthorisationProcessName: 'Application Fees',
        },
        this.recommend.bind(this),
        this.onComplete.bind(this),
      );
      this.doneLoading = false;
    } catch(err) {
      this.doneLoading = false;
      this.message.error(err.message);console.log(err);
    }
  }

  onComplete() {
    const notify: Notify = {
      id: '',
      pid: this.pid,
      cid: this.cid,
      hash: this.txHash,
      is_read: false,
      payment_type: '',
      action_type:'refer',
      time: + new Date,
      user: this.post['owner_addr'].toLowerCase(),
    };
    this.ns.notify(notify);
    this.redireact(this.cid);
  }

  async recommend() {
    try {
      const data = this.genCandidateData();
      const res = await this.cs.recommend(this.cid, this.post['postId']);
      this.txHash = res.tx;
      await this.gs.updatePostAndCandidate(this.post, this.store.curUser, data, res);
      this.store.balance = await this.cs.getCANBalance();
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
  }

  async emailVerify() {
    const your_email = this.validateForm.controls['your_email'].value;
    
    if (!your_email) return;

    this.loading = true;
    await this.ps.verify(your_email, this.store.curUser);
    this.loading = false;
  }
}

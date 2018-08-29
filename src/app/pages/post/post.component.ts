import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CmpPoststep1Component } from './components/cmp-poststep1/cmp-poststep1.component';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { GlobalService } from '@service/global.service';
import { ContractsService } from '@service/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from "../../store";
import { ProfileService } from '@service/profile.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements AfterViewInit {
  @ViewChild(CmpPoststep1Component)
  private step1: CmpPoststep1Component;
  store = Store;
  emailForm: FormGroup;
  validateForm: FormGroup;

  current = 0;

  values: Object = {};

  id: string; // post id

  authState: any = {};
  loading: boolean = false;
  confirmModal: NzModalRef;

  doneLoading: boolean = false;
  pid: string; // type new post id
  type: string = 'new';

  constructor(
    private fb: FormBuilder,
    private gs: GlobalService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private ps: ProfileService,
  ) {
    // this.values = this.ps.getProfile();
    
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.type = params.type;
    })
  }

  ngAfterViewInit() {
    if (this.type == 'edit'){
      this.gs.getPost(this.id)
      .subscribe(post => {
        // init sub cmp
        this.step1.initForm(post, false);
      })
    }
  }

  ngOnInit() {
    if (this.type == 'edit'){
      this.initEdit();
    } else {
      this.initForm(this.values, false);
    }
  }

  initEdit() {
    // 编辑的时候无需验证邮箱
    this.current = 1;
    this.gs.getPost(this.id)
      .subscribe(post => {
        this.values = post;
        // identify
        if (post['owner_addr'] != this.store.curUser) {
          this.router.navigateByUrl(`/noauth`);
        } else {
          this.initForm(this.values, this.type == 'edit');
        }
      })
  }

  initForm(values, disabled): void {
    this.emailForm = this.fb.group({
      your_email: [ { value: values['your_email'], disabled }, [ Validators.email, Validators.required ] ],
      owner_addr: [ { value: this.store.curUser || values['owner_addr'], disabled: true } ],
    });

    this.validateForm = this.fb.group({
      reward_fee: [ { value: values['reward_fee'], disabled }, [ Validators.required, this.rewardValidator ] ],
      cost_fee: [ { value: values['cost_fee'], disabled }, [ Validators.required, this.costValidator ] ],
      salary_currency: [{ value: this.store.selectedCurrency['string'] || '$ USD', disabled: true }],
    });
  }

  async emailVerify() {
    const your_email = this.emailForm.controls['your_email'].value;
    
    if (!your_email) return;

    this.loading = true;
    await this.ps.verify(your_email, this.store.curUser, true);
    this.loading = false;
  }

  rewardValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (!/^\d+$/.test(control.value)) {
      return { number: true };
    } else if (Number(control.value) / (this.store.selectedCurrency['rate'] || 1) < 500) {
      return { minimum: true };
    } else {
      return null;
    }
  }

  costValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (!/^\d+$/.test(control.value)) {
        return { number: true };
    } else {
      return null;
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 0) {
      formData = this.submitForm('emailForm');
      const isVerified = (this.store.authState['email'] == formData.data['your_email']) && this.store.authState['emailVerified'];

      if (!isVerified) {
        formData.valid = false;
        this.showModal('error', 'Please verify your email first!');
      } else {
        this.ps.setProfile(formData.data);
      }
    } else if (this.current === 1) {
      formData = this.step1.submitForm();
      this.values = {...this.values, ...formData.data };

      // init reward by salary_min when type = new
      const salary_min = formData.data['salary_min'] || 0;
      const currencyRate = Number(this.store.selectedCurrency['rate'] || 1);
      this.values['cost_fee'] = Math.ceil(currencyRate * 10);

      if (this.type == 'new') {
        const init_reward_in_currency = salary_min * 0.05 / currencyRate < 500 ? 500 * currencyRate : salary_min * 0.05;
        this.values['reward_fee'] = Math.ceil(init_reward_in_currency);
      }
      this.initForm(this.values, false);
      this.ps.setProfile(formData.data);
    } else if (this.current === 2) {
      // pass directly when edit,because reward info can't edit
      formData = this.type == 'edit' ? { ...this.submitForm(), valid: true } : this.submitForm();
    }
    
    if (formData.valid) {
      this.current += 1;
      window.scroll(0,0);
    }
  }

  showModal(type, message): void {
    this.confirmModal = this.modal[type]({
      nzTitle: message,
      nzOkText: type == 'success' ? null : 'OK',
    });
  }

  clearFile(list) {
    if (!list || !list.length) return;

    return list.map(li => {
      const { name, status, uid, response = {} } = li;
      return { name, status, uid, url: response.url, response };
    })
  }

  genPostData() {
    const reward = Number(this.values['reward']);
    const cost = Number(this.values['cost']);
    let postData = this.values;

    if (this.type == 'new') {
      postData = {referrals_by_user: {}, status: 'pending', nextStatus: 'open', honeypot: reward, reward, cost, ...this.values, time: Date.now(), owner_addr: this.store.curUser };
    } else {
      postData = {...postData, time: Date.now()};
    }

    postData['company_logo'] = this.clearFile(postData['company_logo']);
    postData['job_attachments'] = this.clearFile(postData['job_attachments'])
  
    return JSON.parse(JSON.stringify(postData));
  }

  async done() {
    this.doneLoading = true;

    const postData = this.genPostData();
    this.ps.setProfile(postData);
    const { postId, id, reward, cost } = postData;
    
    if(postId) {// just update db
      this.gs.updatePost(postData)
        .then(() => this.redireact(id));
    } else {
      try {
        if (!id) {// totally new
          this.values['id'] = this.pid = await this.gs.addPostDb(postData);
        } else {
          this.pid = id;
        }
        
        this.cs.canpayInstance(
          {
            amount: reward,
            postAuthorisationProcessName: 'Setting Reward',
          },
          this.addPost.bind(this),
          this.onComplete.bind(this)
        );
        this.doneLoading = false;
      } catch(err) {
        this.doneLoading = false;
        this.message.error(err.message);console.log(err);
      }
    }
  }

  onComplete() {
    this.redireact(this.pid);
  }

  async addPost() {
    try {
      const data = this.genPostData();
      const { id, reward, cost } = data;
      const postId = await this.cs.addPost(id, reward, cost);
      await this.gs.addPostCb(id, postId);
      this.store.balance = await this.cs.getCANBalance();
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
  }

  redireact(id) {
    this.router.navigateByUrl(`/status?type=post&pid=${id}`)
  }

  submitForm(form = 'validateForm'): any {
    for (const i in this[form].controls) {
      this[form].controls[ i ].markAsDirty();
      this[form].controls[ i ].updateValueAndValidity();
      this.values[i] = this[form].controls[ i ].value;
    }

    // handle reward & cost
    if (this.type == 'new') {
      const reward_fee = Number(this.values['reward_fee']);
      const cost_fee = Number(this.values['cost_fee']);
      const currency = Number(this.store.selectedCurrency['rate'] || 1);
  
      this.values['reward_string'] = `${this.values['salary_currency']}: ${reward_fee}`;
      this.values['cost_string'] = `${this.values['salary_currency']}: ${cost_fee}`;
      this.values['reward'] = Math.floor(reward_fee / currency);
      this.values['cost'] = Math.floor(cost_fee / currency);
    }
    
    return {
      valid: this[form].valid,
      data: this.values,
    }
  }
}

import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CmpPoststep1Component } from './components/cmp-poststep1/cmp-poststep1.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { ContractsService } from '../../services/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from "../../store";
import { ProfileService } from '../../services/profile.service';

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
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private gs: GlobalService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private ps: ProfileService,
  ) {
    this.values = this.ps.getProfile();
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth || {};
      console.log(auth)
    });

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
        // TODO: should update email by localStorage?
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
      cost_fee: [ { value: values['cost_fee'] || 10, disabled }, [ Validators.required, this.costValidator ] ],
      salary_currency: [{ value: this.store.selectedCurrency['string'] || '$ USD', disabled: true }],
    });
  }

  async emailVerify() {
    const your_email = this.emailForm.controls['your_email'].value;
    
    if (!your_email) return;

    this.loading = true;
    await this.ps.verify(your_email, this.store.curUser);
    this.loading = false;
  }

  rewardValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (!/^\d+$/.test(control.value)) {
      return { number: true };
    } else if (Number(control.value) < 500) {
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
      const isVerified = (this.authState['email'] == formData.data['your_email']) && this.authState['emailVerified'];

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
      const salary_min = formData.data['salary_min'];
      if (salary_min && this.type == 'new') {
        this.values['reward_fee'] = salary_min * 0.05;
        this.initForm(this.values, false);
      }
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

  async done() {
    this.doneLoading = true;

    const reward = Number(this.values['reward']);
    const cost = Number(this.values['cost']);
    let postData = this.values;
    let handledData;

    if (this.type == 'new') {
      postData = {referrals_by_user: {}, nextStatus: 'open', honeypot: reward, reward, cost, ...this.values, time: Date.now(), owner_addr: this.store.curUser };
    } else {
      postData = {...postData, time: Date.now()};
    }
    
    handledData = JSON.parse(JSON.stringify(postData));
    this.ps.setProfile(handledData);
    // const isUpdate = this.type == 'edit' ? true : false;
    const { postId } = handledData;
    let { id } = handledData;
    // console.log('post', handledData);
    
    if(postId) {// just update db
      this.gs.updatePost(handledData)
        .then(() => this.redireact(handledData['id']));
    } else {
      try {
        if (!id) {// totally new
          id = await this.gs.addPostDb(handledData)
          this.values['id'] = id;
        }
        this.pid = id;
        const postId = await this.cs.addPost(id, reward, cost);
        await this.gs.addPostCb(id, postId);
        this.store.balance = await this.cs.getCANBalance();
        this.redireact(id);
      } catch(err) {
        this.doneLoading = false;
        this.message.error(err.message);console.log(err);
      }
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

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

  verifiedEmail: string = null;
  email: string = null;
  emailVerified: boolean = false;
  verifyLoading: boolean = false;
  displayName: string = '';
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
  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.emailVerified = (auth||{})['emailVerified'];
      this.email = this.verifiedEmail = (auth||{})['email'];
      this.displayName = (auth||{})['displayName'];
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
        this.values = post;
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
      reward: [ { value: values['reward'], disabled }, [ Validators.required, this.rewardValidator ] ],
      cost: [ { value: values['cost'], disabled }, [ Validators.required, this.costValidator ] ],
    });
  }

  async emailVerify() {
    if (!this.email) return;

    this.verifyLoading = true;

    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.store.curUser);
      await this.afAuth.auth.currentUser.updateProfile({displayName: this.store.curUser, photoURL: ''});
      await this.afAuth.auth.currentUser.sendEmailVerification();
      this.showModal('success', 'Please check your email to verify your account');
      this.verifyLoading = false;
    } catch(err) {
      if (err.message == 'The email address is already in use by another account.') {
        this.loginWithEmail();
      } else {
        this.verifyLoading = false;
        this.showModal('error', err.message);
      }
    }
  }

  async loginWithEmail() {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(this.email, this.store.curUser);
      this.verifyLoading = false;
      this.message.success('Verified Success!');
    } catch(err) {
      this.verifyLoading = false;
      if (err.message == 'The password is invalid or the user does not have a password.') {
        this.showModal('error', 'The email address doesn\'t match your MetaMask address!<br/> Please verify a new email.');
      } else {
        this.showModal('error', err.message);
      }
      console.log(err);
    }
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
      formData = this.submitEmailForm();
      const { your_email, owner_addr } = formData.data;

      if ((your_email !== this.verifiedEmail) || (owner_addr !== this.displayName)) {
        formData.valid = false;
        this.showModal('error', 'The email address doesn\'t match your MetaMask address!<br/> Please check it and verify your email.');
      }
    } else if (this.current === 1) {
      formData = this.step1.submitForm();
      this.values = {...this.values, ...formData.data };
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

    const postData = {referrals_by_user: {}, nextStatus: 'open', honeypot: Number(this.values['reward']), owner_addr: this.store.curUser, ...this.values, time: Date.now() };
    const handledData = JSON.parse(JSON.stringify(postData));
    // const isUpdate = this.type == 'edit' ? true : false;
    const { reward, cost, postId } = handledData;
    let { id } = handledData;
    
    if(postId) {// just update db
      this.gs.updatePost(handledData)
        .then(() => this.redireact(handledData['id']));
    } else {
      try {
        if (!id) {// totally new
          id = await this.gs.addPostDb(handledData)
        }
        this.pid = id;
        const postId = await this.cs.addPost(id, Number(reward), Number(cost));
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

  submitEmailForm(): any {
    for (const i in this.emailForm.controls) {
      this.emailForm.controls[ i ].markAsDirty();
      this.emailForm.controls[ i ].updateValueAndValidity();
      this.values[i] = this.emailForm.controls[ i ].value;
    }
    
    return {
      valid: this.emailForm.valid,
      data: this.values,
    }
  }
}

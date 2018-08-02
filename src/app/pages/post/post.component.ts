import { Component, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { CmpPoststep1Component } from './components/cmp-poststep1/cmp-poststep1.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { NzMessageService } from 'ng-zorro-antd';
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
  // new edit noAuth
  type: string = 'new';

  email: string = null;
  emailVerified: boolean = false;
  verifyLoading: boolean = false;

  doneLoading: boolean = false;
  pid: string; // type new post id

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private gs: GlobalService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
  ) {
    this.afAuth.authState.subscribe((auth) => {
      this.emailVerified = (auth||{})['emailVerified'];
      this.email = (auth||{})['email']

      if (this.emailVerified) {
        this.current = 1;
      }
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
          this.type = 'noAuth';
        } else {
          this.initForm(this.values, this.type == 'edit');
        }
      })
  }

  initForm(values, disabled): void {
    this.emailForm = this.fb.group({
      your_email: [ { value: values['your_email'], disabled }, [ Validators.email, Validators.required ] ],
      owner_addr: [ { value: this.store.curUser, disabled: true } ],
    });

    this.validateForm = this.fb.group({
      reward: [ { value: values['reward'], disabled }, [ Validators.required, this.rewardValidator ] ],
      cost: [ { value: values['cost'], disabled }, [ Validators.required, this.costValidator ] ],
    });
  }

  emailVerify(password:string = '' + new Date) {
    if (!this.email) return;

    this.verifyLoading = true;
    return this.afAuth.auth.createUserWithEmailAndPassword(this.email, password)
      .then(() => this.afAuth.auth.currentUser.sendEmailVerification())
      .then(() => {
        this.message.success('please verify your email')
        this.verifyLoading = false;
      })
      .catch(err => {
        console.log(err)
        this.message.error(err.message)
      });
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

  // todo, cancel has no data
  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 1) {
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

  done(): void {
    this.doneLoading = true;

    const postData = {referrals_by_user: {}, honeypot: Number(this.values['reward']), time: Date.now(), owner_addr: this.store.curUser, ...this.values };
    const handledData = JSON.parse(JSON.stringify(postData));
    const isUpdate = this.type == 'edit' ? true : false;
    
    if(isUpdate) {
      this.gs.updatePost(handledData)
      // todo Ceshi 
      .then(id => this.redireact(id))
    } else {
      const { reward, cost } = handledData;

      this.gs.addPostDb(handledData)
        .then(id => {
          this.pid = id;
          return this.cs.addPost(id, Number(reward), Number(cost))
            .then(postId => this.gs.addPostCb(id, postId))
            .then(() => this.redireact(id))
        })
        .catch(err => {
          console.log(err);
        })
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

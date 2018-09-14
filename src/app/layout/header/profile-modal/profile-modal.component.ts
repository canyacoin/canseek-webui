import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProfileService } from '@service/profile.service';
import { ContractsService } from '@service/contracts.service';
import { NotifyService } from '@service/notify.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Profile } from '@class/profile';
import { Store } from '@store';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.less']
})
export class ProfileModalComponent implements OnInit, AfterViewInit {
  store = Store;
  hasNotify: boolean = false;

  visible: boolean = false;
  loading: boolean = false;

  formData = {};
  form: FormGroup;

  constructor(
    private ps: ProfileService,
    private cs: ContractsService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private ns: NotifyService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    this.store.profile = this.ps.getProfile();
  }

  async ngAfterViewInit() {
    this.store.curUser = await this.cs.getAccount()
    this.ns.getUnreadNotifications(this.store.curUser).subscribe(list => {
      this.hasNotify = !!list.length;
    });
  }

  initForm() {
    this.formData = this.ps.getProfile();

    this.form = this.fb.group({
      mm: [ this.formData['mm'] || [this.store.curUser], [ Validators.required ] ],
      your_email: [ this.formData['your_email'], [ Validators.email, Validators.required ] ],
      your_name: [ this.formData['your_name'], [ Validators.required ] ],
      company_name: [ this.formData['company_name'], [ Validators.required ] ],
    });
  }

  showModal(): void {
    this.initForm();
    this.visible = true;
  }

  async handleOk(inSilence: boolean = false) {
    const { valid, data } = this.submitForm();
    const isVerified = (this.store.authState['email'] == data['your_email']) && this.store.authState['emailVerified'];
    
    // save in silence when verify
    if (inSilence) {
      this.ps.setProfile(data);
      return true;
    }

    if (!isVerified) {
      this.modal.error({
        nzTitle: 'Please verify your email first!',
        nzOkText: 'OK',
      });
      return;
    }
    if (valid) {
      this.ps.setProfile(data);
      this.message.success('Save Successfully !');
      this.visible = false;
    } else {
      return;
    }
  }

  submitForm() {
    const data = new Profile();

    for (const i in this.form.controls) {
      this.form.controls[ i ].markAsDirty();
      this.form.controls[ i ].updateValueAndValidity();
      data[i] = this.form.controls[ i ].value;
    }

    return {
      valid: this.form.valid,
      data,
    }
  }

  handleCancel(): void {
    this.visible = false;
  }

  login() {
    const curEmail = this.store.profile.your_email
    const id = this.message.loading('loading').messageId;
    this.ps.login(curEmail)
      .then(() => this.message.remove(id))
      .catch(err => this.message.error(err.message))
  }

  logout() {
    this.modal.confirm({
      nzTitle: 'Sign out',
      nzContent: 'Are you sure you want to sign out of your account ?',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => this.ps.logout()
    });
  }

  async emailVerify() {
    this.handleOk(true);
    const your_email = this.form.controls['your_email'].value;
    
    if (!your_email) return;

    this.loading = true;
    await this.ps.verify(your_email, this.store.curUser);
    this.loading = false;
  }
}

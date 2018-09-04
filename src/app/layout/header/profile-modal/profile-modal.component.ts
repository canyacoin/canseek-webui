import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProfileService } from '@service/profile.service';
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
export class ProfileModalComponent implements OnInit {
  store = Store;
  hasNotify: boolean = false;

  visible: boolean = false;
  loading: boolean = false;

  formData = {};
  form: FormGroup;

  constructor(
    private ps: ProfileService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private ns: NotifyService,
    private modal: NzModalService,
  ) { }

  ngOnInit() {
    // console.log('--------------init store.profile-------------');
    this.store.profile = this.ps.getProfile();
    // TODO
    this.ns.getUnreadNotifications(this.store.curUser).subscribe(list => this.hasNotify = !!list.length);
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

  async handleOk() {
    const { valid, data } = this.submitForm();
    
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
    const your_email = this.form.controls['your_email'].value;
    
    if (!your_email) return;

    this.loading = true;
    await this.ps.verify(your_email, this.store.curUser);
    this.loading = false;
  }
}

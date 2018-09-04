import { Component, OnInit, Input, Inject } from '@angular/core';
import { ProfileService } from '@service/profile.service';
import { NotifyService } from '@service/notify.service';
import { NzMessageService } from 'ng-zorro-antd';
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

      this.loading = true;
      try {
        // TODO
        await this.ps.verify(data['your_email'], this.store.curUser);
        this.visible = false;
      } catch(err) {
        console.log(err);
      }
      this.loading = false;
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
}

import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
// import { AngularFireAuth } from 'angularfire2/auth';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '../../../store';
import { Profile } from '../../../models/profile';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.less']
})
export class ProfileModalComponent implements OnInit {
  visible: boolean = false;
  loading: boolean = false;

  formData = {};
  form: FormGroup;

  store = Store;

  constructor(
    private ps: ProfileService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.formData = this.ps.getProfile();

    console.log(this.formData);
    this.form = this.fb.group({
      mm: [ this.formData['mm'] || this.store.curUser, [ Validators.required ] ],
      your_email: [ this.formData['your_email'], [ Validators.email, Validators.required ] ],
      your_name: [ this.formData['your_name'], [ Validators.required ] ],
      company_name: [ this.formData['company_name'], [ Validators.required ] ],
    });
  }

  showModal(): void {
    this.visible = true;
  }

  async handleOk() {
    const { valid, data } = this.submitForm();
    
    if (valid) {
      this.ps.setProfile(data);

      this.loading = true;
      
      await this.ps.verify(data['your_email'], this.store.curUser);

      this.loading = false;

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

}

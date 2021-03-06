import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@store';
import { wrapTextarea, unwrapTextarea, formatLocation } from '@util';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-cmp-poststep1',
  templateUrl: './cmp-poststep1.component.html',
  styleUrls: ['./cmp-poststep1.component.less']
})
export class CmpPoststep1Component implements OnInit {
  @Input() values;
  @Input() type;

  validateForm: FormGroup;
  store = Store;
  fileList = [];
  logo = [];

  moment = moment;
  optionList = [];

  submitForm(): any {
    const data = {};

    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[ i ]) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
        data[i] = this.validateForm.controls[ i ].value;
        data[i] = wrapTextarea(i, data[i]);
      }
    }

    data['salary_range'] = data['salary_min']
      ? `${data['salary_currency']}: ${data['salary_min']} ~ ${data['salary_max']} ${data['salary_cycle']}`
      : '';

    return {
      valid: this.validateForm.valid,
      data
    };
  }

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm(this.values, false);
  }

  initForm(values, disabled): void {
    const email = values['your_email'];
    const initLocation = values['job_location'] || formatLocation(moment.tz.guess());
    const salary_currency = this.type !== 'edit' ? (this.store.selectedCurrency['string'] || '$ USD') : values['salary_currency'];

    this.validateForm = this.fb.group({
      job_title: [ { value: values['job_title'], disabled }, [ Validators.required ] ],
      job_desc: [ { value: unwrapTextarea(values['job_desc']), disabled }, [ Validators.required ] ],

      job_location: [{ value: initLocation, disabled }, [ Validators.required ]],
      only_show_timezone: [{ value: values['only_show_timezone'], disabled }],

      job_type: [ { value: values['job_type'], disabled }, [ Validators.required ] ],
      job_remote: [ { value: values['job_remote'], disabled } ],

      salary_range: [{ value: values['salary_range'], disabled }],
      salary_currency: [{ value: salary_currency, disabled: true }],
      salary_min: [{ value: values['salary_min'], disabled }, [ this.numberValidator, this.salaryMinValidator ]],
      salary_max: [{ value: values['salary_max'], disabled }, [ this.numberValidator ]],
      salary_cycle: [{ value: values['salary_cycle'] || '/ Annum', disabled }],

      job_attachments: [{ value: values['job_attachments'], disabled }],
      job_level: [ { value: values['job_level'], disabled }, [ Validators.required ] ],
      screening_questions      : [ { value: values['screening_questions'], disabled } ],
      screening_questions2      : [ { value: values['screening_questions2'], disabled } ],
      screening_questions3      : [ { value: values['screening_questions3'], disabled } ],

      company_logo: [ { value: values['company_logo'], disabled }, [ Validators.required ] ],
      company_name: [ { value: values['company_name'], disabled }, [ Validators.required ] ],
      company_website:       [ { value: ((email || '').split('@') || [])[1], disabled: true } ],
      company_desc     : [ { value: unwrapTextarea(values['company_desc']), disabled }, [ Validators.required ] ],

      your_name: [ { value: values['your_name'], disabled }, [ Validators.required ] ],
      your_email: [ { value: email, disabled: true }, [ Validators.email, Validators.required ] ],
      owner_addr: [ { value: this.store.curUser || values['owner_addr'], disabled: true } ],
    });
    this.fileList = values['job_attachments'] || [];
    this.logo = values['company_logo'] || [];
  }

  numberValidator = (control: FormControl) => {
    if (control.value && !/^\d+$/.test(control.value)) {
      return { number: true };
    } else {
      return null;
    }
  }

  salaryMinValidator = (control: FormControl) => {
    if (control.value && /^\d+$/.test(control.value)) {
      const v = Number(control.value);
      const threshold = this.values['reward_fee'] / 0.05;
      if (v > threshold) {
        return { range: true, msg: `Minimum salary can't be more than ${threshold}(reward fee / 5%)` };
      }
    } else {
      return null;
    }
  }

  onChange(value, key) {
    this.validateForm.controls[key].setValue(value);
    this.validateForm.controls[key].setErrors(value && value.length ? null : {required: true});
  }
}

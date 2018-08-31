import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@store';
import { wrapTextarea, unwrapTextarea } from '@util';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment-timezone';
import { Observable, of } from 'rxjs';
const zones = moment.tz.names();
const utcs = Array.from(new Array(25), (x,i) => {
  let number = i - 12;
  let symbol = ((number > 0) && number != 0 ? '+' : '-');
  let format = ('0' + Math.abs(number)).slice(-2);
  return `UTC ${symbol}${format}:00`;
});

@Component({
  selector: 'app-cmp-poststep1',
  templateUrl: './cmp-poststep1.component.html',
  styleUrls: ['./cmp-poststep1.component.less']
})
export class CmpPoststep1Component implements OnInit {
  @Input() values;

  validateForm: FormGroup;
  store = Store;
  fileList = [];
  logo = [];

  moment = moment;
  optionList = [];

  submitForm(): any {
    const data = {};

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      data[i] = wrapTextarea(i, data[i]);
    }

    data['job_range'] = data['salary_min'] ? `${data['salary_currency']}: ${data['salary_min']} ~ ${data['salary_max']} ${data['salary_cycle']}` : '';

    return {
      valid: this.validateForm.valid,
      data
    }
  }

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.initForm(this.values, false);
  }
  
  initForm(values, disabled): void {
    const email = values['your_email'];
    
    this.validateForm = this.fb.group({
      job_title: [ { value: values['job_title'], disabled }, [ Validators.required ] ],
      job_desc: [ { value: unwrapTextarea(values['job_desc']), disabled }, [ Validators.required ] ],

      job_location: [{ value: values['job_location'], disabled }, [ Validators.required ]],
      only_show_timezone: [{ value: values['only_show_timezone'], disabled }],

      job_type: [ { value: values['job_type'], disabled }, [ Validators.required ] ],
      job_remote: [ { value: values['job_remote'], disabled } ],

      job_range: [{ value: values['job_range'], disabled }],
      salary_currency: [{ value: this.store.selectedCurrency['string'] || '$ USD', disabled: true }],
      salary_min: [{ value: values['salary_min'], disabled }, [ this.numberValidator ]],
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

  onChange(value, key) {
    this.validateForm.controls[key].setValue(value);
    this.validateForm.controls[key].setErrors(value && value.length ? null : {required: true});
  }

  onOpenChange() {
    if (this.optionList.length == 0) {
      this.optionList = zones;
    }
  }
  
  onUseUTC(v) {
    this.onChange(null, 'job_location');
    if (v) {
      this.optionList = utcs;
    } else {
      this.optionList = zones;
    }
  }
}

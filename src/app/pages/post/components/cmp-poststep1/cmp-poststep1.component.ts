import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-cmp-poststep1',
  templateUrl: './cmp-poststep1.component.html',
  styleUrls: ['./cmp-poststep1.component.less']
})
export class CmpPoststep1Component implements OnInit {
  validateForm: FormGroup;
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png'
    }
  ];
  submitForm(): any {
    const data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      // data.push({
      //   label: i,
      //   value: this.validateForm.controls[ i ].value
      // })
    }

    return {
      valid: this.validateForm.valid,
      data
    }
  }

  constructor(private fb: FormBuilder) {
  }

  // tslint:disable-next-line:no-any
  handleChange(info: any): void {
    debugger
    const fileList = info.fileList;
    // 2. read from response and show file link
    if (info.file.response) {
      info.file.url = info.file.response.url;
    }
    // 3. filter successfully uploaded files according to response from server
    this.fileList = fileList.filter(item => {
      if (item.response) {
        return item.response.status === 'success';
      }
      return true;
    });
  }


  ngOnInit(): void {
    this.initForm({}, false);
  }
  
  initForm(values, disabled): void {
    this.validateForm = this.fb.group({
      job_title: [ { value: values['job_title'], disabled }, [ Validators.required ] ],
      job_desc: [ { value: values['job_desc'], disabled }, [ Validators.required ] ],
      job_location: [{ value: values['job_location'], disabled }],
      job_type: [ { value: values['job_type'], disabled }, [ Validators.required ] ],
      job_range: [{ value: values['job_range'], disabled }],
      job_attachments: [{ value: values['job_attachments'], disabled }],
      job_level: [ { value: values['job_level'], disabled }, [ Validators.required ] ],
      job_qu1      : [ { value: values['job_qu1'], disabled }, [ Validators.required ] ],
      job_qu2     : [ { value: values['job_qu2'], disabled }, [ Validators.required ] ],
      job_qu3      : [ { value: values['job_qu3'], disabled }, [ Validators.required ] ],

      company_logo: [ { value: values['company_logo'], disabled } ],
      company_name: [ { value: values['company_name'], disabled }, [ Validators.required ] ],
      company_website:       [ { value: values['company_website'], disabled } ],
      company_desc     : [ { value: values['company_desc'], disabled }, [ Validators.required ] ],

      your_name: [ { value: values['your_name'], disabled }, [ Validators.required ] ],
      your_email: [ { value: values['your_email'], disabled }, [ Validators.email, Validators.required ] ],
      your_address: [ { value: values['your_address'], disabled }, [ Validators.required ] ],
    });
  }
}

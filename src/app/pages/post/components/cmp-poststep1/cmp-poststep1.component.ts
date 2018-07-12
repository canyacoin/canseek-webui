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
    this.validateForm = this.fb.group({
      job_title: [ null, [ Validators.required ] ],
      job_desc: [ null, [ Validators.required ] ],
      job_location: [null],
      job_type: [ null, [ Validators.required ] ],
      job_range: [null],
      job_attachments: [null],
      job_level: [ null, [ Validators.required ] ],
      job_qu1      : [ null, [ Validators.required ] ],
      job_qu2     : [ null, [ Validators.required ] ],
      job_qu3      : [ null, [ Validators.required ] ],

      company_logo: [ null ],
      company_name: [ null, [ Validators.required ] ],
      company_website:       [ null ],
      company_desc     : [ null, [ Validators.required ] ],

      your_name: [ null, [ Validators.required ] ],
      your_email: [ null, [ Validators.email, Validators.required ] ],
      your_address: [ null, [ Validators.required ] ],
    });
  }
}

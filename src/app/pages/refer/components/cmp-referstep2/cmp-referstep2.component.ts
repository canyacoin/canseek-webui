import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-cmp-referstep2',
  templateUrl: './cmp-referstep2.component.html',
  styleUrls: ['./cmp-referstep2.component.less']
})
export class CmpReferstep2Component implements OnInit {
  @Input() post: any;
  fileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'http://www.baidu.com/xxx.png'
    }
  ];
  validateForm: FormGroup;

  submitForm(): any {
    let data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
    }
    return {
      valid: this.validateForm.valid,
      data
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(private fb: FormBuilder) {
  }

  // tslint:disable-next-line:no-any
  handleChange(info: any): void {
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
      candidate_name         : [ null, [ Validators.required ] ],
      // todo Validators.phone?
      candidate_phone         : [ null ],
      candidate_email        : [ null, [ Validators.required, Validators.email ] ],
      candidate_website: [null],
      candidate_linkedin: [ null ],
      
      // todo upload
      resume      : [ null/*, [ Validators.required ]*/ ],
      reason     : [ null, [ Validators.required ] ],
      answers      : [ null, [ Validators.required ] ],
      answers2      : [ null, [ Validators.required ] ],
      answers3      : [ null, [ Validators.required ] ],
      cover_letter: [null],
    });
  }

}

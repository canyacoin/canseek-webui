import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { wrapTextarea, unwrapTextarea } from '../../../../util';

@Component({
  selector: 'app-cmp-referstep2',
  templateUrl: './cmp-referstep2.component.html',
  styleUrls: ['./cmp-referstep2.component.less']
})
export class CmpReferstep2Component implements OnInit {
  @Input() post: any;
  @Input() values: any;
  fileList = [];
  cover_letter = [];
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const isMe = this.values['relation'] == 'the talent';

    this.validateForm = this.fb.group({
      candidate_name: [ isMe ? this.values['your_name'] : this.values['candidate_name'], [ Validators.required ] ],
      // candidate_phone: [ this.values['candidate_phone'] ],
      candidate_email: [ isMe ? this.values['your_email'] : this.values['candidate_email'], [ Validators.required ] ],
      candidate_website: [this.values['candidate_website']],
      candidate_linkedin: [ this.values['candidate_linkedin'] ],
      
      resume: [ this.values['resume'], [ Validators.required ] ],
      reason: [ unwrapTextarea(this.values['reason']), [ Validators.required ] ],
      answers: [ unwrapTextarea(this.values['answers'])/*, [ Validators.required, this.answerValidator ]*/ ],
      answers2: [ unwrapTextarea(this.values['answers2']) ],
      answers3: [ unwrapTextarea(this.values['answers3']) ],
      cover_letter: [ this.values['cover_letter'] ],
    });
    this.fileList = this.values['resume'] || [];
    this.cover_letter = this.values['cover_letter'] || [];
  }

  submitForm(): any {
    let data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      data[i] = wrapTextarea(i, data[i]);
    }
    // data['resume'] = this.fileList;
    // data['cover_letter'] = this.cover_letter;
    console.log(data);
    return {
      valid: this.validateForm.valid,
      data
    }
  }

  answerValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (control.value.split(' ').length > 200) {
      return { maxlength: true };
    } else {
      return null;
    }
  }

  onChange(value, key) {
    this.validateForm.controls[key].setValue(value);
    this.validateForm.controls[key].setErrors(value.length ? null : {required: true});
  }
}

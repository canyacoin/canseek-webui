import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-cmp-referstep1',
  templateUrl: './cmp-referstep1.component.html',
  styleUrls: ['./cmp-referstep1.component.less']
})
export class CmpReferstep1Component implements OnInit {

  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
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

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name         : [ null, [ Validators.required ] ],
      email        : [ null, [ Validators.email ] ],
      relation     : [ null, [ Validators.required ] ],
      address      : [ null, [ Validators.required ] ],

      // password         : [ null, [ Validators.required ] ],
      // checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      // phoneNumberPrefix: [ '+86' ],
      // phoneNumber      : [ null, [ Validators.required ] ],
      // website          : [ null, [ Validators.required ] ],
      // captcha          : [ null, [ Validators.required ] ],
      // agree            : [ false ]
    });
  }

}

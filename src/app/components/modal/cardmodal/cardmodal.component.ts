import { Component, OnInit, Input  } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cardmodal',
  templateUrl: './cardmodal.component.html',
  styleUrls: ['./cardmodal.component.css']
})
export class CardmodalComponent implements OnInit {
  @Input() c: any;
  @Input() d: any;
  @Input() cardForm: FormControl;
  @Input() balance: number = 0;
  constructor() { }

  ngOnInit() {
  }
  checkEmail() {
    const { email, company } = this.cardForm.value;
    const domain = email.match(/@(\S*)\./i) ? email.match(/@(\S*)\./)[1] : '';
    const errObj = domain.toLowerCase() === company.toLowerCase() ? null : { 'nomatch': true };
    // console.log(this.cardForm.get('email'));
    this.cardForm.get('email').setErrors(errObj);
  }
}

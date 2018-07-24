import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-cmp-verify',
  templateUrl: './cmp-verify.component.html',
  styleUrls: ['./cmp-verify.component.less']
})
export class CmpVerifyComponent implements OnInit {

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  verify(email, name) {
    this.auth.emailVerify(email, name);
  }

}

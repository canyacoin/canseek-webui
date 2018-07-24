import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  emailVerified: boolean = false;

  constructor(
    private afAuth: AngularFireAuth,
    private message: NzMessageService,
  ) { 
    this.afAuth.authState.subscribe((auth) => {
      this.emailVerified = (auth||{})['emailVerified'];
    })
  }

  getEmailVerified() {
    return this.emailVerified;
  }
  
  emailVerify(email:string, displayName, password:string = '' + new Date) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return user.updateProfile({ displayName })
                  .then(() => user.sendEmailVerification)
      })
      .then(() => this.message.success('please verify your email'))
      .catch(error => {
        console.log(error)
        this.message.error(error.message)
      });
  }
}

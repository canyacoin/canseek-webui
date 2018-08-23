import { Injectable } from '@angular/core';
import { Profile } from '../models/profile';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AngularFireAuth } from 'angularfire2/auth';
import * as gravatar from 'gravatar';
import { Store } from '../store';
const MsgAlreadyVerified = 'You\'ve verified';
const MsgVerifyEmailSent = 'Verification email sent, please check your inbox for an email from noreply@canseek.com';
const MsgVerifyRequired = 'Please verify your email or refresh to update your login status';
const MsgAlreadyLogin = 'The email address is already in use by another account.';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  store = Store;
  confirmModal: NzModalRef;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private afAuth: AngularFireAuth,
  ) { 
    this.afAuth.authState.subscribe((auth) => {
      this.store.authState = auth || {};
    });
  }

  getProfile(): Profile {
    const mm = localStorage.getItem('mm') ? localStorage.getItem('mm').split(',') : undefined;
    const your_email = localStorage.getItem('your_email');
    const your_name = localStorage.getItem('your_name');
    const company_name = localStorage.getItem('company_name');
    
    return {
      mm,
      your_email,
      your_name,
      company_name,
    }
  }

  setProfile(profile: Profile) {
    const { mm, your_email, your_name, company_name } = profile;

    localStorage.setItem('mm', mm.join(','));
    localStorage.setItem('your_email', your_email);
    localStorage.setItem('your_name', your_name);
    localStorage.setItem('company_name', company_name);
  }

  async verify(email: string, displayName: string) {
    const isVerified = (this.store.authState['email'] == email) && this.store.authState['emailVerified'];

    if (isVerified) {
      this.msgModal('success', MsgAlreadyVerified);
      return;
    }
    if (this.store.authState['email'] == email && !this.store.authState['emailVerified']) {
      this.msgModal('info', MsgVerifyRequired);
      return;
    }

    try {
      await this.signinWithEmail(email, displayName);
    } catch(err) {
      if (err.message == MsgAlreadyLogin) {
        await this.loginWithEmail(email);
      } else {
        this.msgModal('error', err.message);
        console.log(err);
      }
    }
  }

  async signinWithEmail(email: string, displayName: string) {
    const photoURL = await gravatar.url(email);

    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(email, email);
      await this.afAuth.auth.currentUser.updateProfile({displayName, photoURL});
      await this.afAuth.auth.currentUser.sendEmailVerification();
      this.msgModal('success', MsgVerifyEmailSent);
    } catch (err) {
      throw err;
    }
  }

  async loginWithEmail(email: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, email);
      this.msgModal('success', 'Login Success!');
    } catch(err) {
      this.msgModal('error', err.message);
      console.log(err);
    }
  }

  msgModal(type, message): void {
    this.confirmModal = this.modal[type]({
      nzTitle: message,
      nzOkText: 'OK',
    });
  }
}

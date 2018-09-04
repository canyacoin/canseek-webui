import { Injectable } from '@angular/core';
import { Profile } from '@class/profile';
import { NzModalService } from 'ng-zorro-antd';
import { AngularFireAuth } from 'angularfire2/auth';
import * as gravatar from 'gravatar';
import { Store } from '@store';
import { clearEmpty } from '@util';
import { Authstate } from '@class/authstate';
const MsgVerifyEmailSent = 'Verification email sent, please check your inbox for an email from noreply@canseek.com';
const MsgVerifyRequired = 'Verification email sent, please verify your email or refresh to update your login status';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  store = Store;

  constructor(
    private modal: NzModalService,
    private afAuth: AngularFireAuth,
  ) { 
    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        this.store.authState = auth;
      }
    });
  }

  getProfile(): Profile {
    // const mm = localStorage.getItem('mm') ? localStorage.getItem('mm').split(',') : undefined;
    const mm = clearEmpty(localStorage.getItem('mm')) || this.store.curUser;
    const your_email = clearEmpty(localStorage.getItem('your_email'));
    const your_name = clearEmpty(localStorage.getItem('your_name'));
    const company_name = clearEmpty(localStorage.getItem('company_name'));
    
    return {
      mm,
      your_email,
      your_name,
      company_name,
    }
  }

  setProfile(profile: Profile) {
    // incremental update
    const _profile = { ...this.getProfile(), ...JSON.parse(JSON.stringify(profile)) };
    
    localStorage.setItem('mm', _profile['mm']);
    localStorage.setItem('your_email', _profile['your_email']);
    localStorage.setItem('your_name', _profile['your_name']);
    localStorage.setItem('company_name', _profile['company_name']);

    // update store
    this.store.profile = _profile;
  }

  async verify(email: string, displayName: string) {
    const isVerified = (this.store.authState['email'] == email) && this.store.authState['emailVerified'];

    if (isVerified) {
      return;
    }

    // login but not verified
    if (this.store.authState['email'] == email && !this.store.authState['emailVerified']) {
      this.modal.confirm({
        nzTitle: 'Confirm',
        nzContent: MsgVerifyRequired,
        nzOkText: 'OK',
        nzCancelText: 'Resend',
        nzOnCancel: async() => {
          await this.sendEmail(email, clearEmpty(displayName));
        }
      });
      return;
    }

    try {
      await this.create(email, displayName);
    } catch(err) {
      await this.login(email);
    }
  }

  async sendEmail(email: string, displayName: string = 'Jane Doe') {
    const photoURL = await gravatar.url(email);

    await this.afAuth.auth.currentUser.updateProfile({displayName, photoURL});
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.msgModal('success', MsgVerifyEmailSent);
  }

  async create(email: string, displayName: string) {
    await this.afAuth.auth.createUserWithEmailAndPassword(email, email);
    await this.sendEmail(email, clearEmpty(displayName));
  }

  async login(email: string) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, email);
    } catch(err) {
      this.msgModal('error', err.message);
      console.log(err);
    }
  }

  msgModal(type, message): void {
    this.modal[type]({
      nzTitle: message,
      nzOkText: 'OK',
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.store.authState = new Authstate;
  }
}

import { Injectable } from '@angular/core';
import { Profile } from '../models/profile';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';

const MsgVerifyEmail = 'Please check your email to verify your account';
const MsgAlreadyLogin = 'The email address is already in use by another account.';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  confirmModal: NzModalRef;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
  ) { }

  async getProfile(): Promise<Profile> {
    return Promise.resolve({
      mm: [],
      your_email: '',
      emailVerified: false,
      your_name: '',
      company_name: '',
      owner_addr: '',
    })
  }

  async setProfile(Profile) {
    
  }

  signinWithEmail(your_email: string, owner_addr: string) {

  }

  loginWithEmail(your_email: string) {

  }

  msgModal(type, message): void {
    this.confirmModal = this.modal[type]({
      nzTitle: message,
      nzOkText: type == 'success' ? null : 'OK',
    });
  }

}

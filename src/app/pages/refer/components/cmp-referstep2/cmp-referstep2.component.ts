import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';
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

  submitForm(): any {
    let data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      data[i] = wrapTextarea(i, data[i]);
    }
    data['resume'] = this.fileList;
    data['cover_letter'] = this.cover_letter;

    return {
      valid: this.validateForm.valid,
      data
    }
  }

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    const isMe = this.values['relation'] == 'the talent';

    this.validateForm = this.fb.group({
      candidate_name: [ isMe ? this.values['your_name'] : this.values['candidate_name'], [ Validators.required ] ],
      // candidate_phone: [ this.values['candidate_phone'] ],
      candidate_email: [ isMe ? this.values['your_email'] : this.values['candidate_email'], [ Validators.required ] ],
      candidate_website: [this.values['candidate_website']],
      candidate_linkedin: [ this.values['candidate_linkedin'] ],
      
      resume: [ this.values['resume'] ],
      reason: [ unwrapTextarea(this.values['reason']), [ Validators.required ] ],
      answers: [ unwrapTextarea(this.values['answers'])/*, [ Validators.required, this.answerValidator ]*/ ],
      answers2: [ unwrapTextarea(this.values['answers2']) ],
      answers3: [ unwrapTextarea(this.values['answers3']) ],
      cover_letter: [ this.values['cover_letter'] ],
    });
    this.fileList = this.values['resume'] || [];
    this.cover_letter = this.values['cover_letter'] || [];
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

  handleChange(info: any, key: string = 'fileList') {
    this[key] = info.fileList;
  }

  uploadFile = (item: any) => {
    const file = item.file;
    const fileName = file.name;
    const filePath = `${file.lastModified}-${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().subscribe(snapshot => {
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        fileRef.getDownloadURL().subscribe(url => {
          this.fileList = this.fileList.map(item => {
            if (item.name == fileName) {
              return { ...item, status: 'done', percent: 100, url, thumbUrl: url }
            }
            return item;
          })
          this.handleChange({fileList: this.fileList})
        })
      }
    })
  }

  uploadCoverLetter = (item: any) => {
    const file = item.file;
    const fileName = file.name;
    const filePath = `${file.lastModified}-${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().subscribe(snapshot => {
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        fileRef.getDownloadURL().subscribe(url => {
          this.cover_letter  = this.cover_letter .map(item => {
            if (item.name == fileName) {
              return { ...item, status: 'done', percent: 100, url, thumbUrl: url }
            }
            return item;
          });
          this.handleChange({ fileList: this.cover_letter }, 'cover_letter');
        })
      }
    })
  }

  isPdf = (file) => {
    const isPdf = file.type == 'application/pdf';
    
    if (!isPdf) {
      this.message.error('You can only upload a PDF!');
    }
    return isPdf;
  }
}

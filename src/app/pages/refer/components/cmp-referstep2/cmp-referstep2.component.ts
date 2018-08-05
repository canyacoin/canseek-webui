import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-cmp-referstep2',
  templateUrl: './cmp-referstep2.component.html',
  styleUrls: ['./cmp-referstep2.component.less']
})
export class CmpReferstep2Component implements OnInit {
  @Input() post: any;
  fileList = [];
  cover_letter = [];
  validateForm: FormGroup;

  submitForm(): any {
    let data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
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
    this.validateForm = this.fb.group({
      candidate_name         : [ null, [ Validators.required ] ],
      candidate_phone         : [ null ],
      candidate_email        : [ null, [ Validators.required, Validators.email ] ],
      candidate_website: [null],
      candidate_linkedin: [ null ],
      
      resume      : [ null ],
      reason     : [ null, [ Validators.required ] ],
      answers      : [ null/*, [ Validators.required, this.answerValidator ]*/ ],
      answers2      : [ null ],
      answers3      : [ null ],
      cover_letter: [null],
    });
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
          this.handleChange({ fileList: this.cover_letter })
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

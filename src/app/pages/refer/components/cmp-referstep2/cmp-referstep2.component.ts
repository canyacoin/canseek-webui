import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cmp-referstep2',
  templateUrl: './cmp-referstep2.component.html',
  styleUrls: ['./cmp-referstep2.component.less']
})
export class CmpReferstep2Component implements OnInit {
  @Input() post: any;
  fileList = [];
  validateForm: FormGroup;

  submitForm(): any {
    let data = [];

    this.handleChange({fileList: this.fileList});
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
    }
    data['resume'] = this.fileList;

    return {
      valid: this.validateForm.valid,
      data
    }
  }

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
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
      answers      : [ null, [ Validators.required ] ],
      answers2      : [ null ],
      answers3      : [ null ],
      cover_letter: [null],
    });
  }

  handleChange(info: any, key: string = 'fileList') {
    this[key] = info.fileList;

    // let errObj = null;
    // if (!info.fileList.length) {
    //   errObj = { required: true };
    // }
    // this.validateForm.controls['resume'].setErrors(errObj);
    // console.log(errObj);
  }

  uploadFile = (item: any) => {
    const file = item.file;
    const fileName = file.name;
    const filePath = `${file.lastModified}-${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.fileList = this.fileList.map(item => {
              if (item.name == fileName){
                return {...item, url, thumbUrl: url}
              }
              return item
            })
            this.handleChange({fileList: this.fileList})
          })
        })
      )
      .subscribe(snapshot => {
        if (snapshot.bytesTransferred == snapshot.totalBytes) {
          this.fileList = this.fileList.map(item => {
            if (item.name == fileName) {
              return { ...item, status: 'done', percent: 100 }
            }
            return item;
          })
          this.handleChange({fileList: this.fileList})
        }
      })
  }
}

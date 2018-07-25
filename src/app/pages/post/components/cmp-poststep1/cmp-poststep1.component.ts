import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '../../../../store';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cmp-poststep1',
  templateUrl: './cmp-poststep1.component.html',
  styleUrls: ['./cmp-poststep1.component.less']
})
export class CmpPoststep1Component implements OnInit {
  @Input() email;

  validateForm: FormGroup;
  store = Store;
  fileList = [];
  logo = [];

  submitForm(): any {
    const data = [];

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      // data.push({
      //   label: i,
      //   value: this.validateForm.controls[ i ].value
      // })
    }
    data['job_attachments'] = this.fileList;
    data['company_logo'] = this.logo;
    // console.log('step1', data);
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
    this.initForm({}, false);
  }
  
  initForm(values, disabled): void {
    this.validateForm = this.fb.group({
      job_title: [ { value: values['job_title'], disabled }, [ Validators.required ] ],
      job_desc: [ { value: values['job_desc'], disabled }, [ Validators.required ] ],
      job_location: [{ value: values['job_location'], disabled }],
      job_type: [ { value: values['job_type'], disabled }, [ Validators.required ] ],
      job_remote: [ { value: values['job_remote'], disabled } ],
      job_range: [{ value: values['job_range'], disabled }],
      job_attachments: [{ value: values['job_attachments'], disabled }],
      job_level: [ { value: values['job_level'], disabled }, [ Validators.required ] ],
      screening_questions      : [ { value: values['screening_questions'], disabled }, [ Validators.required ] ],
      screening_questions2      : [ { value: values['screening_questions2'], disabled } ],
      screening_questions3      : [ { value: values['screening_questions3'], disabled } ],

      company_logo: [ { value: values['company_logo'], disabled } ],
      company_name: [ { value: values['company_name'], disabled }, [ Validators.required ] ],
      company_website:       [ { value: values['company_website'], disabled } ],
      company_desc     : [ { value: values['company_desc'], disabled }, [ Validators.required ] ],

      your_name: [ { value: values['your_name'], disabled }, [ Validators.required ] ],
      your_email: [ { value: values['your_email'] || this.email, disabled: true }, [ Validators.email, Validators.required ] ],
      owner_addr: [ { value: this.store.curUser, disabled: true } ],
    });
  }

  handleChange(info: any, key: string = 'fileList') {
    // console.log('handleChange', info);
    this[key] = info.fileList;
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

  uploadImage= (item: any) => {
    const file = item.file;
    const fileName = file.name;
    const filePath = `${file.lastModified}-${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.logo = this.logo.map(item => {
              if (item.name == fileName){
                return {...item, url, thumbUrl: url}
              }
              return item
            })
            this.handleChange({fileList: this.logo}, 'logo')
          })
        })
      )
      .subscribe(snapshot => {
        if (snapshot.bytesTransferred == snapshot.totalBytes) {
          this.logo = this.logo.map(item => {
            if (item.name == fileName) {
              return { ...item, status: 'done', percent: 100 }
            }
            return item;
          })
          this.handleChange({fileList: this.logo}, 'logo')
        }
      })
  }
}

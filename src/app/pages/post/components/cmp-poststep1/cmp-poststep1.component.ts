import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Store } from '../../../../store';
import { wrapTextarea, unwrapTextarea } from '../../../../util';
import { AngularFireStorage } from 'angularfire2/storage';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-cmp-poststep1',
  templateUrl: './cmp-poststep1.component.html',
  styleUrls: ['./cmp-poststep1.component.less']
})
export class CmpPoststep1Component implements OnInit {
  @Input() values;
  @Input() email;

  validateForm: FormGroup;
  store = Store;
  fileList = [];
  logo = [];

  previewImage = '';
  previewVisible = false;

  submitForm(): any {
    const data = {};

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      data[i] = this.validateForm.controls[ i ].value;
      data[i] = wrapTextarea(i, data[i]);
    }

    data['job_range'] = data['salary_min'] ? `${data['salary_currency']}: ${data['salary_min']} ~ ${data['salary_max']} ${data['salary_cycle']}` : '';
    data['job_attachments'] = this.fileList;
    data['company_logo'] = this.logo;

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
    this.initForm(this.values, false);
  }
  
  initForm(values, disabled): void {
    this.validateForm = this.fb.group({
      job_title: [ { value: values['job_title'], disabled }, [ Validators.required ] ],
      job_desc: [ { value: unwrapTextarea(values['job_desc']), disabled }, [ Validators.required ] ],
      job_location: [{ value: values['job_location'], disabled }],
      job_type: [ { value: values['job_type'], disabled }, [ Validators.required ] ],
      job_remote: [ { value: values['job_remote'], disabled } ],

      job_range: [{ value: values['job_range'], disabled }],
      salary_currency: [{ value: this.store.selectedCurrency['string'] || '$ USD', disabled: true }],
      salary_min: [{ value: values['salary_min'], disabled }],
      salary_max: [{ value: values['salary_max'], disabled }],
      salary_cycle: [{ value: values['salary_cycle'] || '/ Annum', disabled }],
      
      job_attachments: [{ value: values['job_attachments'], disabled }],
      job_level: [ { value: values['job_level'], disabled }, [ Validators.required ] ],
      screening_questions      : [ { value: values['screening_questions'], disabled } ],
      screening_questions2      : [ { value: values['screening_questions2'], disabled } ],
      screening_questions3      : [ { value: values['screening_questions3'], disabled } ],

      company_logo: [ { value: values['company_logo'], disabled } ],
      company_name: [ { value: values['company_name'], disabled }, [ Validators.required ] ],
      company_website:       [ { value: ((this.email || '').split('@') || [])[1], disabled: true } ],
      company_desc     : [ { value: unwrapTextarea(values['company_desc']), disabled }, [ Validators.required ] ],

      your_name: [ { value: values['your_name'], disabled }, [ Validators.required ] ],
      your_email: [ { value: values['your_email'] || this.email, disabled: true }, [ Validators.email, Validators.required ] ],
      owner_addr: [ { value: this.store.curUser || values['owner_addr'], disabled: true } ],
    });
    this.fileList = values['job_attachments'] || [];
    this.logo = values['company_logo'] || [];
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

  isImage = (file) => {
    const isImage = /^image\//.test(file.type);
    
    if (!isImage) {
      this.message.error('You can only upload a Image!');
    }
    return isImage;
  }

  isPdf = (file) => {
    const isPdf = file.type == 'application/pdf';
    
    if (!isPdf) {
      this.message.error('You can only upload a PDF!');
    }
    return isPdf;
  }

  uploadImage = (item: any) => {
    const file = item.file;
    const fileName = file.name;
    const filePath = `${file.lastModified}-${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().subscribe(snapshot => {
      if (snapshot.bytesTransferred == snapshot.totalBytes) {
        fileRef.getDownloadURL().subscribe(url => {
          this.logo = this.logo.map(item => {
            if (item.name == fileName) {
              return { ...item, status: 'done', percent: 100, url, thumbUrl: url }
            }
            return item;
          });
          this.handleChange({fileList: this.logo}, 'logo')
        })
      }
    })
  }

  handlePreview = (file: any) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}

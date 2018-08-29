import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { Subscription } from 'rxjs/Subscription';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-cmp-upload',
  templateUrl: './cmp-upload.component.html',
  styleUrls: ['./cmp-upload.component.less']
})
export class CmpUploadComponent implements OnInit, OnDestroy {
  @Input() catogery: string;
  @Input() nzListType: string;
  @Input() fileList: Array<Object> = [{}];
  @Output() onChange:EventEmitter<Array<Object>> = new EventEmitter();

  subscription: Subscription = new Subscription();

  constructor(
    private storage: AngularFireStorage,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleChange(info: any) {
    this.fileList = info.fileList;
    this.onChange.emit(this.fileList);
    console.log(this.fileList);
  }

  customRequest = (req: any) => {
    const { file } = req;
    const fileName = file.name;
    const filePath = `/${this.catogery}/${file.lastModified}_${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    const subscription = task.snapshotChanges().subscribe(
      snapshot => {
        const { bytesTransferred = 0, totalBytes = 1 } = snapshot;
        const percent = (bytesTransferred / totalBytes) * 100;
        req.onProgress({percent});
      },
      error => {
        req.onError(error);
      },
      () => {
        const subscriptionForUrl = fileRef.getDownloadURL().subscribe(url=> {
          req.onSuccess({url});
        });
        this.subscription.add(subscriptionForUrl);
      });
    
    this.subscription.add(subscription);
  }

  beforeUpload = (file) => {
    const isPdf = file.type == 'application/pdf';
    const isLt512M = file.size / 1024 / 1024 < 512;

    if (!isPdf) {
      this.message.error('You can only upload PDF files!');
    }
    if (!isLt512M) {
      this.message.error('File must smaller than 512 MB');
    }

    return isPdf && isLt512M;
  }


  beforeUploadImg = (file) => {
    const isImage = /^image\//.test(file.type);
    const isMultiple = this.fileList.length;
    const isLt512M = file.size / 1024 / 1024 < 512;
    
    if (!isImage) {
      this.message.error('You can only upload image file!');
    }
    if (isMultiple) {
      this.message.error('You can only upload one Image!');
    }
    if (!isLt512M) {
      this.message.error('File must smaller than 512 MB');
    }

    return isImage && !isMultiple && isLt512M;
  }
}

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  @Input() fileList: Array<Object> = [{}];

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
  }

  customRequest = (req: any) => {
    const { file } = req;
    const fileName = file.name;
    const filePath = `/${this.catogery}/${fileName}`;
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

    if (!isPdf) {
      this.message.error('You can only upload PDF files!');
    }
    return isPdf;
  }
}

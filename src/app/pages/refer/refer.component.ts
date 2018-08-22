import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { CmpReferstep2Component } from './components/cmp-referstep2/cmp-referstep2.component';
import { GlobalService } from '../../services/global.service';
import { ProfileService } from '../../services/profile.service';
import { ContractsService } from '../../services/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from "../../store";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.less']
})
export class ReferComponent implements AfterViewInit {
  @ViewChild(CmpReferstep2Component)
  private step2: CmpReferstep2Component;

  current = 0;
  validateForm: FormGroup;
  values: Object = {};

  store = Store;
  post: Object = {};

  doneLoading: boolean = false;

  pid: string = '';
  cid: string = '';
  
  constructor(
    private fb: FormBuilder,
    private gs: GlobalService,
    private ps: ProfileService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
  ) {
    this.values = this.ps.getProfile();
    this.validateForm = this.fb.group({
      your_name: [ this.values['your_name'], [ Validators.required ] ],
      your_email: [ this.values['your_email'], [ Validators.required, Validators.email ] ],
      relation: [ null, [ Validators.required ] ],
      owner_addr: [ { value: this.store.curUser, disabled: true } ],
    });
    this.getPost();
  }

  ngAfterViewInit() {
  }

  submitForm(): any {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
      this.validateForm.controls[ i ].updateValueAndValidity();
      this.values[i] = this.validateForm.controls[ i ].value;
    }
    return {
      valid: this.validateForm.valid,
      data: this.values,
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 0) {
      formData = this.submitForm();
      this.ps.setProfile(formData.data);
    } else if (this.current === 1) {
      formData = this.step2.submitForm();
      this.values = {...this.values, ...formData.data};
    }
    
    if (formData.valid) {
      this.current += 1;
      window.scroll(0,0);
    }
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.gs.getPost(id)
      .subscribe(post => {
        this.post = post;
        // identify
        if (post['owner_addr'] === this.store.curUser) {
          this.router.navigateByUrl('/noauth');
        }
      });
  }

  redireact(id) {
    this.router.navigateByUrl(`/status?type=refer&pid=${this.post['id']}&cid=${id}`)
  }

  genCandidateData() {
    const CandidateData = {...this.values, time: Date.now() };
  
    return JSON.parse(JSON.stringify(CandidateData));
  }

  async done() {
    this.doneLoading = true;

    const candidateData = this.genCandidateData();
    const { id } = candidateData;

    try {
      if (!id) {
        this.values['id'] = candidateData['id'] = this.cid = await this.gs.addCandidateDb(this.post, candidateData);
      }
      this.pid = this.post['id'];

      this.cs.canpayInstance(
        this.post['cost'], 
        this.onComplete.bind(this),
        null,
        'Application Fee',
        this.recommend.bind(this)
      )
    } catch(err) {
      this.doneLoading = false;
      this.message.error(err.message);console.log(err);
    }
  }

  onComplete() {
    this.redireact(this.cid);
  }

  async recommend() {
    const data = this.genCandidateData();
    const res = await this.cs.recommend(this.cid, this.post['postId']);
    await this.gs.updatePostAndCandidate(this.post, this.store.curUser, data, res);
    this.store.balance = await this.cs.getCANBalance();
  }
}

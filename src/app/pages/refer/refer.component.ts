import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CmpReferstep2Component } from './components/cmp-referstep2/cmp-referstep2.component';
import { GlobalService } from '../../services/global.service';
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
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
  ) {
    this.validateForm = this.fb.group({
      your_name         : [ null, [ Validators.required ] ],
      your_email        : [ null, [ Validators.required, Validators.email ] ],
      relation     : [ null, [ Validators.required ] ],
      owner_addr      : [ { value: this.store.curUser, disabled: true } ],
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
        if (post['owner_addr'] === this.store.curUser) {
          this.router.navigateByUrl('/noauth');
        }
      });
  }

  redireact(id) {
    this.router.navigateByUrl(`/status?type=refer&pid=${this.post['id']}&cid=${id}`)
  }

  done(): void {
    this.doneLoading = true;

    const CandidateData = {...this.values, time: Date.now() };
    const CandidatedData = JSON.parse(JSON.stringify(CandidateData));

    this.gs.addCandidateDb(this.post, CandidatedData)
      .then(cid => {
        this.cid = cid;
        CandidatedData.id = cid;
        this.pid = this.post['id'];
        return this.cs.recommend(cid, this.post['postId'])
          .then(candidateId => this.gs.updatePostAndCandidate(this.post, CandidatedData, candidateId))
          .then(() => this.redireact(cid))
      })
      .catch(err => {
        this.message.error(err.message)
        console.log(err);

      })
  }
}

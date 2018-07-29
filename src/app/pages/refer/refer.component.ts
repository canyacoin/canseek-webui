import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { CmpReferstep2Component } from './components/cmp-referstep2/cmp-referstep2.component';
import { PostService } from '../../services/post.service';
import { ContractsService } from '../../services/contracts/contracts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from "../../store";

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
    private ps: PostService,
    private cs: ContractsService,
    private router: Router,
    private route: ActivatedRoute,
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
    }
  }

  getPost(): void {
    const { id } = this.route.snapshot.params;

    this.ps.getPost(id)
      .subscribe(post => {
        this.post = post;
      });
  }

  redireact(id) {
    this.router.navigateByUrl(`/status?type=refer&pid=${this.post['id']}&cid=${id}`)
  }

  done(): void {
    this.doneLoading = true;

    const CandidateData = {...this.values, time: Date.now() };
    const CandidatedData = JSON.parse(JSON.stringify(CandidateData));

    this.ps.addCandidateDb(this.post, CandidatedData)
      .then(cid => {
        this.cid = cid;
        this.pid = this.post['id'];
        return this.cs.recommend(cid, this.post['postId'])
        // return Promise.race([
        //   this.cs.recommend(cid, this.post['postId']), 
        //   this.ps.timeoutRace({id: cid}, 3000)
        // ])
        .then((res) => this.ps.addCandidateCb(this.post, cid, res))
        .then(() => this.redireact(cid))
      })
      .catch(err => {
        // if (err.id) {
        //   this.redireact(err.id)
        // } else {
          console.log(err);
        // }
      })
  }
}

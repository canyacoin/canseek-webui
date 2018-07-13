import { Component, AfterViewInit, ViewChild  } from '@angular/core';
import { CmpPoststep1Component } from './components/cmp-poststep1/cmp-poststep1.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router} from '@angular/router';
import { Store } from "../../store";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements AfterViewInit {
  @ViewChild(CmpPoststep1Component)
  private step1: CmpPoststep1Component;
  store = Store;
  rewardForm: FormGroup;

  current = 0;

  values: Object = {};
  valuesArr = [];

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 0) {
      formData = this.step1.submitForm();
      this.values = formData.data;
    } else if (this.current === 1) {
      formData = this.submitForm();
      for (const label in formData.data) {
        this.valuesArr.push({
          label,
          value: formData.data[label]
        });
        // if (formData.data.hasOwnProperty(label)) {
        //   const element = formData.data[label];
          
        // }
      }
    }
    
    if (formData.valid) {
      this.current += 1;
    }
  }

  done(): void {
    const postData = {...this.values, time: Date.now(), ownerAddr: this.store.curUser };
    this.ps.addPost(postData)
    .then(result => {
      debugger
      const { id } = result;
      this.router.navigateByUrl(`/status?type=post&id=${id}`);
    })
  }

  submitForm(): any {
    for (const i in this.rewardForm.controls) {
      this.rewardForm.controls[ i ].markAsDirty();
      this.rewardForm.controls[ i ].updateValueAndValidity();
      this.values[i] = this.rewardForm.controls[ i ].value;
      // this.values.push({
      //   label: i,
      //   value: this.rewardForm.controls[ i ].value
      // })
    }
    
    return {
      valid: this.rewardForm.valid,
      data: this.values,
    }
  }

  constructor(
    private fb: FormBuilder,
    private ps: PostService,
    private router: Router,
  ) {
    this.rewardForm = this.fb.group({
      reward: [ null, [ Validators.required ] ],
      cost: [ null, [ Validators.required ] ],
    });
  }
  ngAfterViewInit() {
  }
}

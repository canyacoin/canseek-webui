import { Component, AfterViewInit, ViewChild  } from '@angular/core';
import { CmpPoststep1Component } from './components/cmp-poststep1/cmp-poststep1.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  validateForm: FormGroup;

  current = 1;

  values: Object = {};
  valuesArr = [];

  // new edit noAuth
  type: string;

  constructor(
    private fb: FormBuilder,
    private ps: PostService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }
  ngAfterViewInit() {
    this.init();
  }
  
  init(): void {
    this.route.queryParams.subscribe(params => {
      const { type, id } = params;
      this.type = type;

      if (type == 'edit'){
        this.ps.getPost(id)
          .subscribe(post => {
            this.values = post;
            if (post['owner_addr'] != this.store.curUser) {
              this.type = 'noAuth';
            } else {
              this.initForm(this.values, this.type == 'edit');
            }
          })
      } else {
        this.initForm(this.values, false);
      }
    });
  }

  rewardValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (!/^\d+$/.test(control.value) || Number(control.value) < 500) {
        return { error: true };
    } else {
      return null;
    }
  }

  costValidator = (control: FormControl) => {
    if (!control.value) {
      return { required: true };
    } else if (!/^\d+$/.test(control.value)) {
        return { error: true };
    } else {
      return null;
    }
  }
  

  initForm(values, disabled): void {
    disabled && this.step1.initForm(values, false);
    this.validateForm = this.fb.group({
      reward: [ { value: values['reward'], disabled }, [ Validators.required, this.rewardValidator ] ],
      cost: [ { value: values['cost'], disabled }, [ Validators.required, this.costValidator ] ],
    });
  }

  // todo, cancel has no data
  pre(): void {
    this.current -= 1;
  }

  next(): void {
    let formData;

    if (this.current === 0) {
      formData = this.step1.submitForm();
      this.values = {...this.values, ...formData.data };
    } else if (this.current === 1) {
      // pass directly when isUpdate
      formData = this.type == 'edit' ? { ...this.submitForm(), valid: true } : this.submitForm();
      for (const label in formData.data) {
        this.valuesArr.push({
          label,
          value: formData.data[label]
        });
      }
    }
    
    if (formData.valid) {
      this.current += 1;
    }
  }

  done(): void {
    const postData = {...this.values, time: Date.now(), owner_addr: this.store.curUser };
    const handledData = JSON.parse(JSON.stringify(postData));
    const isUpdate = this.type == 'edit' ? true : false;
    
    if(isUpdate) {
      this.ps.updatePost(handledData);
      setTimeout(() => this.router.navigateByUrl(`/status?type=post&pid=${handledData['id']}`), 0);
    } else {
      this.ps.addPost(handledData)
        .then(result => this.router.navigateByUrl(`/status?type=post&pid=${result.id}`))
    }
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
}

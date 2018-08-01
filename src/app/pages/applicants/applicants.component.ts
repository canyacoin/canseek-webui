import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '../../services/global.service';
import { Store } from "../../store";
import * as moment from 'moment';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.less']
})
export class ApplicantsComponent implements OnInit {
  category: string = localStorage.getItem('category') || 'all';
  loading: boolean = true;
  post: any;
  pid: string;
  hasAuth: boolean = true;
  canHire: boolean = false;

  candidates: any;
  results: any;

  store = Store;
  
  moment = moment;
  confirmModal: NzModalRef;

  selectedCandidates = [];
  loadingStatus: boolean = false;

  customStyle = {
    'background'   : '#fff',
    'border-radius': '4px',
    'margin-bottom': '24px',
    'border'       : '0px',
    'padding'      : '10px 20px 18px 40px'
  };

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getCandidates();
    this.checkAuth();
  }

  getCandidates() {
    const { id } = this.route.snapshot.params;

    this.pid = id;
    this.gs.getCandidates(id)
      .subscribe(candidates => {
        this.candidates = candidates;
        this.loading = false;
        this.searchCategory();
      });
  }

  checkAuth() {
    const { id } = this.route.snapshot.params;

    this.gs.getPost(id)
      .subscribe(post => {
        this.post = post;
        this.hasAuth = (post['owner_addr'] === this.store.curUser);
        this.canHire = post['status'] == 'open';
      })
  }

  searchCategory() {
    const { candidates, category } = this;
    let next;

    localStorage.setItem('category', category);
    switch(category) {
      case 'all':
        next = candidates; 
        break;
      case 'unrefined':
        next = candidates
          .filter(item => item.category != 'shortlist' && item.category != 'rejected')
          .sort((a, b) => b.time - a.time);
        break;
      case 'shortlist':
      case 'rejected':
        next = candidates
          .filter(item => item.category == category)
          .sort((a, b) => b.time - a.time);
        break;
    }

    this.results = next;
  }

  changeCandidateCat(cid, category) {
    this.gs.changeCandidateCat(this.pid, cid, category);
  }

  selectC(v) {
    this.selectedCandidates = v;
  }

  changeActive(cid) {
    this.results = this.results.map(c => {
      if (c.id == cid) {
        const { active } = c;
        return {...c, active: !active};
      }
      return c;
    })
  }

  closePost() {
    const item = this.selectedCandidates[0];
    const cid = item.split(' ')[0];
    const candidateId = item.split(' ')[1];
    this.post['nextStatus'] = 'closed';

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to select this candidate?',
      nzOkText: 'Yes',
      nzCancelText: 'Cancel',
      nzOnOk: () => 
      this.gs.closePost(this.post, cid, candidateId)
        .then(() => this.message.success('closePost succ!'))
        .catch(err => {
          console.log(err);
          this.message.error(err.message);
        })
    });
  }

  updatePostStatus(post) {
    this.loadingStatus = true;
    this.gs.updatePostStatus(post)
      .then(() => {
        this.loadingStatus = false;
        this.message.success('updated');
      })
      .catch(err => {
        this.loadingStatus = false;
        this.message.error(err.message);
        console.log(err);
      })
  }
}

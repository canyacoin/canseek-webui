import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { PostService } from '../../services/post.service';
import { Store } from "../../store";
import * as moment from 'moment';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.less']
})
export class ApplicantsComponent implements OnInit {
  filterStatus: string = localStorage.getItem('filterStatus') || 'all';
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

  customStyle = {
    'background'   : '#fff',
    'border-radius': '4px',
    'margin-bottom': '24px',
    'border'       : '0px',
    'padding'      : '10px 20px 18px 40px'
  };

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,
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
    this.ps.getCandidates(id)
      .subscribe(candidates => {
        this.candidates = candidates;
        this.loading = false;
        this.searchStatus();
      });
  }

  checkAuth() {
    const { id } = this.route.snapshot.params;

    this.ps.getPost(id)
      .subscribe(post => {
        this.post = post;
        this.hasAuth = (post['owner_addr'] === this.store.curUser);
        this.canHire = post['status'] == 'open';
      })
  }

  searchStatus() {
    const { candidates, filterStatus } = this;
    let next;

    localStorage.setItem('filterStatus', filterStatus);
    switch(filterStatus) {
      case 'all':
        next = candidates; 
        break;
      case 'unrefined':
        next = candidates
          .filter(item => item.status != 'shortlist' && item.status != 'rejected')
          .sort((a, b) => b.time - a.time);
        break;
      case 'shortlist':
      case 'rejected':
        next = candidates
          .filter(item => item.status == filterStatus)
          .sort((a, b) => b.time - a.time);
        break;
    }

    this.results = next;
  }

  changeCandidateStatus(cid, status) {
    this.ps.changeCandidateStatus(this.pid, cid, status);
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

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to select this candidate?',
      nzOkText: 'Yes',
      nzCancelText: 'Cancel',
      nzOnOk: () => 
      this.ps.closePost(this.post, cid, candidateId)
        .then(() => this.message.create('succ', 'closePost succ!'))
        .catch(() => this.message.create('error', 'Oops error'))
    });
  }
}

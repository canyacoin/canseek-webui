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
  loadingStatus: boolean = false;

  category: string = 'all';

  post: any;
  pid: string;

  candidates: any;
  results: any;

  store = Store;
  
  moment = moment;
  confirmModal: NzModalRef;

  customStyle = {
    'background'   : '#fff',
    'border-radius': '5px',
    'margin-bottom': '24px',
    'border'       : '0px',
    'padding'      : '20px'
  };

  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const { id } = this.route.snapshot.params;

    this.pid = id;
    await this.getPost();
    await this.getCandidates();
    this.updatePendingCandidates();
  }

  getPost() {
    return new Promise((resolve, reject) => {
      this.gs.getPost(this.pid)
        .subscribe(post => {
          // check auth
          if (post['owner_addr'] !== this.store.curUser) {
            this.router.navigateByUrl(`/noauth`);
          }
          this.post = post;
          resolve(1);
        });
    });
  }

  getCandidates() {
    return new Promise((resolve, reject) => {
      this.gs.getCandidates(this.pid)
        .subscribe(candidates => {
          candidates = (candidates || [])
            .filter(c => c.status !== 'pending')
            .sort((a, b) => b.time - a.time);

          this.candidates = candidates;
          this.searchCategory();
          resolve(1);
        });
    });
  }

  updatePendingCandidates() {
    this.candidates
      .filter(c => c.status == 'pending')
      .map(c => this.gs.updatePendingCandidate(this.post || {}, c))
  }

  searchCategory() {
    const { candidates, category } = this;
    let next;

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

  changeCandidateCat(candidate, category) {
    const { id: cid } = candidate;
    this.gs.changeCandidateCat(this.pid, cid, category);
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

  closePost(candidate) {
    const { id: cid, candidateId } = candidate;
    
    this.post['nextStatus'] = 'closed';

    this.confirmModal = this.modal.confirm({
      nzTitle: 'Are your sure you want to select this candidate?',
      nzOkText: 'Yes',
      nzCancelText: 'Cancel',
      nzOnOk: () => 
      this.gs.closePost(this.post, cid, candidateId)
        .then(() => this.message.success('success!'))
        .catch(err => {
          this.message.error(err.message);console.log(err);
        })
    });
  }

  updatePostStatus(post) {
    this.loadingStatus = true;
    this.gs.updatePendingPost(post)
      .then(() => {
        this.loadingStatus = false;
        this.message.success('updated');
      })
      .catch(err => {
        this.loadingStatus = false;
        this.message.error(err.message);console.log(err);;
      })
  }
}

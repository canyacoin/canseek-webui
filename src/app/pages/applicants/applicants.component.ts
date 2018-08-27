import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '../../services/global.service';
import { ContractsService } from '../../services/contracts.service';
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
    private message: NzMessageService,
    private router: Router,
    private cs: ContractsService,
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
    if (!candidates) return;
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
    this.post['nextStatus'] = 'closed';

    this.cs.canpayInstance(
      {
        dAppName: candidate.candidate_name,
        amount: this.post['honeypot'],
        postAuthorisationProcessName: 'Winning Reward',
      },
      this.hire.bind(this, candidate),
      // this.onComplete.bind(this)
    );
  }
  onComplete() {
    debugger//TODO redirect    
  }

  async hire(candidate) {
    try {
      const { id: cid, candidateId } = candidate;
      await this.gs.closePost(this.post, cid, candidateId);
      return Promise.resolve({status: 1});
    } catch(err) {
      return Promise.reject(err);
    }
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

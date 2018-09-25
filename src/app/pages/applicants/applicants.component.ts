import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { GlobalService } from '@service/global.service';
import { ContractsService } from '@service/contracts.service';
import { Notify} from '@class/notify';
import { NotifyService } from '@service/notify.service';
import { Store } from '../../store';
import * as moment from 'moment';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.less']
})
export class ApplicantsComponent implements OnInit {
  loadingStatus = false;

  category = 'all';

  post: any;
  pid: string;
  cid: string;

  candidates: any;
  results: any;

  store = Store;

  moment = moment;

  txHash: string;

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
    private ns: NotifyService,
  ) {
    this.route.queryParams.subscribe(params => {
      this.cid = params.cid;
    });
  }

  async ngOnInit() {
    const { id } = this.route.snapshot.params;
    this.pid = id;

    await this.getPost();
    await this.getCandidates();
    // this.updatePendingCandidates();
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
          this.candidates = (candidates || [])
            .filter(c => c.status !== 'pending')
            .sort((a, b) => b.time - a.time);

          (candidates || [])
            .filter(c => c.status === 'pending')
            .map(c => this.gs.updatePendingCandidate(this.post || {}, c));
          this.searchCategory();
          resolve(1);
        });
    });
  }

  searchCategory() {
    const { candidates, category } = this;
    if (!candidates) { return; }
    let next;

    switch (category) {
      case 'all':
        next = candidates;
        break;
      case 'unrefined':
        next = candidates
          .filter(item => item.category !== 'shortlist' && item.category !== 'rejected')
          .sort((a, b) => b.time - a.time);
        break;
      case 'shortlist':
      case 'rejected':
        next = candidates
          .filter(item => item.category === category)
          .sort((a, b) => b.time - a.time);
        break;
    }
    if (this.cid) {
      next = next.map(n => n.id.toLowerCase() === this.cid.toLowerCase() ? {...n, active: true} : n);
    }
    this.results = next;
  }

  changeCandidateCat(candidate, category) {
    const { id: cid } = candidate;
    this.gs.changeCandidateCat(this.pid, cid, category);
  }

  changeActive(cid) {
    this.results = this.results.map(c => {
      if (c.id === cid) {
        const { active } = c;
        return {...c, active: !active};
      }
      return c;
    });
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
      this.onComplete.bind(this, candidate)
    );
  }
  onComplete(candidate) {
    const notify: Notify = {
      id: '',
      pid: this.post['id'],
      cid: candidate['id'],
      hash: this.txHash,
      is_read: false,
      payment_type: 'in',
      action_type: 'close',
      time: + new Date,
      user: candidate['owner_addr'].toLowerCase(),
    };
    this.ns.notify(notify);
    this.message.success('The reward has sent to the winning candidate successfully!');
  }

  async hire(candidate) {
    try {
      const { id: cid, candidateId } = candidate;
      await this.gs.closePostDb(this.post['id'], cid);
      const result = await this.gs.closePost(this.post, cid, candidateId);
      this.txHash = result.result['tx'];
      return Promise.resolve({status: 1});
    } catch (err) {
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
        this.message.error(err.message); console.log(err);
      });
  }
}

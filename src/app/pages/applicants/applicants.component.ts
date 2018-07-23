import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  pid: string;
  hasAuth: boolean = true;
  canHire: boolean = false;

  candidates: any;
  results: any;

  store = Store;
  
  moment = moment;

  customStyle = {
    'background'   : '#fff',
    'border-radius': '4px',
    'margin-bottom': '24px',
    'border'       : '0px'
  };

  constructor(
    private route: ActivatedRoute,
    private ps: PostService,
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

  changeCandidateStatus(e, cid, status) {
    e.preventDefault();
    e.stopPropagation();

    this.ps.changeCandidateStatus(this.pid, cid, status);
  }

  closePost() {
    console.log('closePost');
  }
}

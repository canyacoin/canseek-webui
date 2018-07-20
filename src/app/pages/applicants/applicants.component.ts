import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Store } from "../../store";

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.less']
})
export class ApplicantsComponent implements OnInit {
  statusValue: string = 'all';
  loading: boolean = true;
  pid: string;
  hasAuth: boolean = true;

  candidates: any;
  results: any;

  store = Store;

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
        this.candidates = candidates
        this.loading = false;
        this.searchStatus();
      });
  }

  checkAuth() {
    const { id } = this.route.snapshot.params;

    this.ps.getPost(id)
      .subscribe(post => this.hasAuth = (post['owner_addr'] === this.store.curUser))
  }

  searchStatus() {
    const { candidates, statusValue } = this;

    localStorage.setItem('statusValue', statusValue);
    switch(statusValue) {
      case 'all':
      this.results = candidates; break;
      case 'shortlist':
      case 'rejected':
      this.results = candidates
        .filter(item => item.status === statusValue)
        .sort((a, b) => b.time - a.time);
        break;
    }
  }

  closePost() {
    console.log('closePost');
  }
}

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: any = JSON.parse( localStorage.getItem('credentials') );

  constructor(private router: Router,
    private modalService: NgbModal, 
  ) { }

  ngOnInit() {
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      
    }, (reason) => {});
  }
}

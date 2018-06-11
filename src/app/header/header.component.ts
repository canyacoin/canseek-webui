import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { CardService } from '../components/service/card.service';
import { Card } from '../components/model/card';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ContractsService } from '../services/contracts/contracts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  balance: number = 0;
  cardForm: FormGroup;
  card: Card = new Card();
  curUser: string;
  currentUser: any = JSON.parse( localStorage.getItem('credentials') );

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal, 
    private cs: ContractsService,
    private cardService: CardService,
  ) { }

  ngOnInit() {
    this.getAccount();
  }
  async getAccount() {
    this.curUser = await this.cs.getAccount();
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {}, () => {});
  }
  
  opencard(content) {
    this.getBalance();
    const initCard = this.card;
    this.cardForm = this.formBuilder.group(initCard);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = { ...initCard, ...this.cardForm.value, ownerAddr: this.curUser, time: Date.now(), honeypot: this.cardForm.value.bounty };
        
        // console.log(curCard);
        this.cardService.addCard(curCard);
        // this.searchStatus();
      }
    }, () => {})
  }
  getBalance() {
    this.cs.getCANBalance()
      .then(b => this.balance = b);
  }
}

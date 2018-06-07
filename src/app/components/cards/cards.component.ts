import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup/*, FormControl, Validators */ } from '@angular/forms';
import { Card, statusArr } from '../model/card';
import { CardService } from '../service/card.service';
import { ContractsService } from '../../services/contracts/contracts.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../model/candidate';
import { Observable, from } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  loading: boolean = true;
  curUser: string; // cur user address
  balance: number;
  type: string = 'new';// new edit read

  cards: Card[];
  card: Card = new Card();
  candidate: Candidate = new Candidate();
  candidates: Candidate[];
  cardTmp: any;
  candidateID: any;
  candidateCID: any;

  results: Card[];
  statusArr = statusArr;
  statusIndex = 1;
  email: string;
  
  checkboxGroupForm: FormGroup;
  candidateForm: FormGroup;
  cardForm: FormGroup;
  moment = moment;
  
  constructor(private cardService: CardService,
              private cs: ContractsService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder,
            ) { }

  ngOnInit() {
    this.getAccount();
    this.getCards();
    this.getBalance();
  }
  async getAccount() {
    this.curUser = await this.cs.getAccount();
    console.log('get account: ', this.curUser);
  }
  getBalance() {
    this.cs.getCANBalance()
      .then(b => this.balance = b);
    console.log(this.balance);
  }
  
  getCards(): void {
    this.cardService.getCards()
      .subscribe(cards => {
        this.cards = cards
        this.loading = false;
        this.searchStatus();
      });
  }
  
  searchStatus() {
    const { cards, statusIndex} = this;
    const next = cards
      .filter(item => item.status === statusArr[statusIndex])
      .sort((a, b) => b.time - a.time);
    this.results = next;
    console.log('filter by status: ', this.statusArr[statusIndex])
  }
  
  // new or edit card
  openCard(content, card, type) {
    this.getBalance();
    this.type = type;
    const initCard = (type === 'new' && JSON.stringify(card) === '{}') ? this.card : card;
    this.cardForm = this.formBuilder.group(initCard);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = { ...initCard, ...this.cardForm.value, ownerAddr: this.curUser, time: Date.now() };
        console.log('create card: ', curCard);
        
        if (type === 'edit') {
          this.cardService.updateCard(curCard);
        } else if (type === 'new') {
          this.cardService.addCard({ ...curCard, honeypot: curCard.bounty });
        }
        this.searchStatus();
      }
    }, (reason) => {})
  }

  // cancel card
  openCancelCard(content, card) {
    console.log(`cancel card: ${JSON.stringify(card)}`);
    this.modalService.open(content).result.then((result) => {
      if(result === 'cancelPost') {
        card.nextStatus = 'cancelled';
        this.cardService.cancelCard(card);
      }
    }, (reason) => {});
  }

  updateCardStatus(card) {
    console.log(`will update card: ${JSON.stringify(card)}`);
    
    this.cardService.updateCardStatus(card);
  }

  openCandidate(content, card) {
    this.getBalance();
    this.cardTmp = card;
    this.candidateForm = this.formBuilder.group(this.candidate);
    this.modalService.open(content).result.then((result) => {
      const curCandidate = { ...this.candidateForm.value, time: Date.now() }
      console.log(`candidate: `, curCandidate);
      if(result === 'onOk') {
        this.cardService.addCandidate(card, curCandidate, this.curUser);
      }
    }, (reason) => {});
  }
  addCandidate(card, candidate, event) {
    event && event.stopPropagation();
    this.cardService.addCandidate(card, candidate, this.curUser);
  }

  openCandidates(content, card, type) {
    this.cardTmp = card;
    this.type = type;
    this.cardService.getCandidates(card.id).subscribe(candidates => {
      this.candidates = candidates
        .sort((a, b) => a.time - b.time);
      console.log(`get candidates succ`, candidates);
      this.modalService.open(content).result.then((result) => {
        if (result === 'closePost') {
          card.nextStatus = 'closed';
          this.cardService.closePost(card, this.candidateCID, this.candidateID);
        } else if (result === 'getRefund') {
          this.cardService.getRefund(card, this.curUser, this.candidateCID);
        }
        console.log(result);
      }, (reason) => {});
    })
  }
  updateCandidateStatus(candidate, event) {
    event && event.stopPropagation();
    console.log(`will updateCandidateStatus`, candidate);
    this.cardService.updateCandidateStatus(this.cardTmp, candidate);
  }
  
  selectCandidate(e, candidateId) {
    const id = e.target.value;
    this.candidateCID = id;
    this.candidateID = candidateId;
    e.stopPropagation();
    console.log(`select id: ${this.candidateCID} ${this.candidateID}`);
  }

  checkEmail() {
    const { email, company } = this.cardForm.value;
    const domain = email.match(/@(\S*)\./) ? email.match(/@(\S*)\./)[1] : '';
    const errObj = domain === company ? null : { 'nomatch': true };
    this.cardForm.controls['email'].setErrors(errObj);
  }
}

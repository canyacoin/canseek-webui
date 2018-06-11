import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup/*, FormControl, Validators */ } from '@angular/forms';
import { Card, statusArr } from '../model/card';
import { CardService } from '../service/card.service';
import { ContractsService } from '../../services/contracts/contracts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../model/candidate';
import { Message } from '../model/message';
import { MessageService } from '../service/message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  loading: boolean = true;
  curUser: string; // cur user address
  balance: number = 0;
  type: string = 'new';// new edit read
  candidatesModalTmp: any;

  message: Message = new Message;
  cards: Card[];
  card: Card = new Card();
  candidate: Candidate = new Candidate();
  candidates: Candidate[];
  cardTmp: any;
  candidateID: any;
  candidateCID: any;

  results: Card[];
  statusArr = statusArr;
  statusIndex = 0;
  email: string;
  
  checkboxGroupForm: FormGroup;
  candidateForm: FormGroup;
  cardForm: FormGroup;
  moment = moment;
  
  constructor(private cardService: CardService,
              private cs: ContractsService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder,
              public ms: MessageService,
            ) { }

  ngOnInit() {
    this.getAccount();
    this.getCards();
    this.getBalance();
  }
  async getAccount() {
    this.curUser = await this.cs.getAccount();
  }
  getBalance() {
    this.cs.getCANBalance()
      .then(b => this.balance = b);
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
    const { cards, statusIndex } = this;
    let next;
    switch(statusIndex) {
      case 0:
        next = cards; break;
      case 1:
      case 2:
      case 3:
      case 4:
        next = cards
        .filter(item => item.status === statusArr[statusIndex])
        .sort((a, b) => b.time - a.time);
        break;
      case 5:
        next = cards.filter(item => item.ownerAddr === this.curUser)
        .sort((a, b) => b.time - a.time);
        break;
      case 6:
        next = cards.filter(item => item.recommenders[this.curUser])
        .sort((a, b) => b.time - a.time);
        break;
    }
    this.results = next;
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
    this.modalService.open(content).result.then((result) => {
      if(result === 'cancelPost') {
        card.nextStatus = 'cancelled';
        this.cardService.cancelCard(card);
      }
    }, (reason) => {});
  }

  openContent(content, card) {
    this.cardTmp = card;
    this.modalService.open(content).result.then((result) => {}, (reason) => {});
  }

  updateCardStatus(card) {
    
    this.cardService.updateCardStatus(card);
  }

  openCandidate(content, card) {
    this.getBalance();
    this.cardTmp = card;
    this.candidateForm = this.formBuilder.group(this.candidate);
    this.modalService.open(content).result.then((result) => {
      const curCandidate = { ...this.candidateForm.value, time: Date.now() }
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
        
      this.candidatesModalTmp = !this.candidatesModalTmp ? this.modalService.open(content) : this.candidatesModalTmp;
      this.candidatesModalTmp.result.then((result) => {
        this.candidatesModalTmp = null;

        if (result === 'closePost') {
          card.nextStatus = 'closed';
          this.cardService.closePost(card, this.candidateCID, this.candidateID);
        } else if (result === 'getRefund') {
          this.cardService.getRefund(card, this.curUser, this.candidateCID);
        }
      }, () => {
        this.candidatesModalTmp = null;
      });
    })
  }
  updateCandidateStatus(candidate, event) {
    event && event.stopPropagation();
    this.cardService.updateCandidateStatus(this.cardTmp, candidate);
  }
  
  selectCandidate(e, candidateId) {
    const id = e.target.value;
    this.candidateCID = id;
    this.candidateID = candidateId;
    e.stopPropagation();
  }

  checkEmail() {
    const { email, company } = this.cardForm.value;
    const domain = email.match(/@(\S*)\./i) ? email.match(/@(\S*)\./)[1] : '';
    const errObj = domain.toLowerCase() === company.toLowerCase() ? null : { 'nomatch': true };
    this.cardForm.controls['email'].setErrors(errObj);
  }
  buyCan() {
    this.cs.buyCAN()
      .then(delta => this.balance += delta)
      .catch(err => console.error(err));
  }
}

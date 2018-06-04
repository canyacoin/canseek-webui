import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup/*, FormControl, Validators */ } from '@angular/forms';
import { Card, statusArr } from '../model/card';
import { CardService } from '../service/card.service';
import { ContractsService } from '../../services/contracts/contracts.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../model/candidate';

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
  posts: Object;
  card: Card = new Card();
  candidate: Candidate = new Candidate();
  candidates: Candidate[];
  cardTmp: any;

  results: Card[];
  statusArr = statusArr;
  statusIndex = 1;
  email: string;
  
  checkboxGroupForm: FormGroup;
  candidateForm: FormGroup;
  cardForm: FormGroup;
  
  constructor(private cardService: CardService,
              private cs: ContractsService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder,
            ) { }

  ngOnInit() {
    this.getAccount();
    this.getAllPosts();
    this.getCards();
    this.getBalance();
  }

  async getAccount() {
    this.curUser = await this.cs.getAccount();
    console.log('get account: ', this.curUser);
  }
  async getBalance() {
    this.balance = await this.cs.getCANBalance();
    console.log(`balance: ${this.balance}`);
  }
  getAllPosts() {
    this.cs.getAllPosts()
      .then(results => {
        console.log(`all posts: `, results);
        // this.posts = results;
      });
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
    const next = cards.filter(item => item.status === statusArr[statusIndex]);
    this.results = next;
    console.log('filter by status: ', this.statusArr[statusIndex])
  }
  
  // new or edit card
  openCard(content, card, type) {
    this.type = type;
    const initCard = (type === 'new' && JSON.stringify(card) === '{}') ? this.card : card;
    this.cardForm = this.formBuilder.group(initCard);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = { ...initCard, ...this.cardForm.value, ownerAddr: this.curUser };
        
        console.log(`${type} curCard: `, curCard);
        if (type === 'edit') {
          this.cardService.updateCard(curCard);
        } else if (type === 'new') {
          this.cardService.addCard(curCard);
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
    this.cardTmp = card;
    this.candidateForm = this.formBuilder.group(this.candidate);
    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        this.cardService.addCandidate(card, this.candidateForm.value);
      }
    }, (reason) => {});
  }
  addCandidate(card, candidate) {
    this.cardService.addCandidate(card, candidate);
  }

  openCandidates(content, card, type) {
    this.cardTmp = card;
    this.type = type;
    this.cardService.getCandidates(card.id).subscribe(candidates => {
      this.candidates = candidates;
      console.log(`get candidates succ`);
      this.modalService.open(content).result.then((result) => {
        if (result === 'closePost') {
          card.nextStatus = 'closed';
          this.cardService.closePost(card, this.candidate);
        }
        console.log(result);
      }, (reason) => {});
    })
  }
  updateCandidateStatus(candidate) {
    console.log(`will updateCandidateStatus`, candidate);
    this.cardService.updateCandidateStatus(this.cardTmp, candidate);
  }
  changeCan() {
    // this.updateCandidateStatus
    console.log(this.candidate);
  }
}

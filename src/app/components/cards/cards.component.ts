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
  type: string = 'new';// new edit read

  cards: Card[];
  candidates: Candidate[];
  card: Card = new Card();
  candidate: Candidate = new Candidate();

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
    this.whoAmI();
    this.getCards();
  }

  async whoAmI() {
    this.curUser = await this.cs.getAccount();
    console.log('who am i: ', this.curUser);
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
    const initCard = type === 'new' ? this.card : card;
    this.cardForm = this.formBuilder.group(initCard);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = {  ownerAddr: this.curUser, ...initCard, ...this.cardForm.value};
        
        console.log(`${type} curCard: `, curCard);
        if (type === 'edit') {
          this.cardService.updateCard(curCard);
        } else if (type === 'new') {
          this.cardService.addCard(curCard);
        }
        this.searchStatus();
      }
    }, (reason) => {

    })
  }

  // cancel card
  cancelcard(content, card) {
    console.log(`cancel card: ${JSON.stringify(card)}`);
    this.modalService.open(content).result.then((result) => {
      if(result === 'cancelPost') {
        this.cardService.cancelCard(card);
      }
    });
  }


  updateCardStatus(card) {
    console.log(`will update card: ${JSON.stringify(card)}`);
    
    this.cardService.updateCardStatus(card);
  }

  openCandidate(content, card) {
    this.candidateForm = this.formBuilder.group(this.candidate);
    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const value = { id: (card.candidates || []).length, ...this.candidateForm.value};
        this.cardService.addCandidate(card, value);
      }
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCandidates(content, candidates, type) {
    this.candidates = candidates;
    this.type = type;
    console.log(candidates);
    // this.candidatesForm = this.formBuilder.group({
    //   candidates: candidates,
    // });
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}

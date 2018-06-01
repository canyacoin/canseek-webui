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
  checkboxGroupForm: FormGroup;
  candidatesForm: FormGroup;
  cardForm: FormGroup;
  cards: Card[];
  results: Card[];
  statusArr = statusArr;
  statusIndex = 2;

  // new or edit a card
  card = {
    "title": '',
    "email": '',
    "bounty": null,
    "cost": null,
    "desc": '',
    "company": '',
    "logo": '',
    "status": 'pending',
  };
  type: string = 'new';// new edit read

  // new or list candidate
  Candidate: Candidate;
  email: string;

  // cur user address
  curUser: string;

  // list candidates or chose a candidate
  candidates: Candidate[];
  constructor(private cardService: CardService,
              private cs: ContractsService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder,
            ) { }

  ngOnInit() {
    this.getCards();
    this.whoAmI();
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
  }
  open(content, card) {
    // this.card = card;
    console.log('open card: ', card);
    this.modalService.open(content).result.then((result) => {
      if(result === 'cancelPost') {
        this.cardService.cancelPost(card.postId);
      }
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  openCard(content, card, type) {
    this.type = type;
    const initCard = type === 'new' ? this.card : card;
    this.cardForm = this.formBuilder.group(initCard);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = {  ownerAddr: this.curUser, ...initCard, ...this.cardForm.value};
        
        console.log('curCard: ', curCard);
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}

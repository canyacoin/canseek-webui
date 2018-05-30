import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup/*, FormControl, Validators */ } from '@angular/forms';
import { Card } from '../model/card';
import { CardService } from '../service/card.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../model/candidate';
import { debug } from 'util';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  checkboxGroupForm: FormGroup;
  candidatesForm: FormGroup;
  cardForm: FormGroup;
  cards: Card[];
  results: Card[];
  code = 0;
  statusArr = ['open', 'closed', 'cancelled'];

  // new or edit a card
  card = {
    "email": '',
    "bounty": 0,
    "cost": 0,
    "title": '',
    "logo": '',
    "company": '',
    "desc": ''
  };
  type: string = 'new';

  // new or list candidate
  Candidate: Candidate;
  email: string;

  // cur user address
  curUser = '0x0';

  // list candidates or chose a candidate
  candidates: Candidate[];

  constructor(private cardService: CardService, private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getCards();
    this.searchStatus();
  }
  getCards(): void {
    this.results = this.cards = this.cardService.getCards();
  }
  searchStatus() {
    const { cards, code, statusArr } = this;
    const next = cards.filter(item => item.status === statusArr[code]);
    this.results = next;
  }
  open(content, card, type) {
    this.card = card || this.card;
    this.type = type;

    // test form in modal
    this.checkboxGroupForm = this.formBuilder.group({
      left: true,
      middle: false,
      right: false
    });
    
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openCard(content, card, type) {
    this.card = card;
    this.type = type;

    if(type === 'new') {
      card = {
        title: '',
        email: '',
        bounty: null,
        cost: null,
        desc: '',
        company: '',
        logo: '',
      }
    }
    
    this.cardForm = this.formBuilder.group(card);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = { status: 'open', ...this.cardForm.value};
        
        if (type === 'edit') {
          const nextCards = this.cards.map(card => {
            if(card.id === curCard.id) {
              return { ...card, ...curCard };
            }
            return card;
          });
          this.cards = nextCards;
        } else if (type === 'new') {
          this.cards = this.cards.concat(curCard);
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

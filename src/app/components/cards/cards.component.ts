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
  checkboxGroupForm: FormGroup;
  candidatesForm: FormGroup;
  cardForm: FormGroup;
  cards: Card[];
  results: Card[];
  statusArr = statusArr;
  statusIndex = 2;

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
  constructor(private cardService: CardService,
              private service: ContractsService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder,
            ) { }

  ngOnInit() {
    this.getCards();
    this.whoAmI();
  }

  async whoAmI() {
    this.curUser = await this.service.getAccount();
  }
  
  getCards(): void {
    this.cardService.getCards()
      .subscribe(cards => {
        this.cards = cards
        this.searchStatus();
      });
  }
  
  searchStatus() {
    const { cards, statusIndex} = this;
    const next = cards.filter(item => item.status === statusArr[statusIndex]);
    this.results = next;
  }
  open(content, card, type) {
    this.card = card || this.card;
    this.type = type;
    
    this.modalService.open(content).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  initCardModal(card, type) {
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
        status: 'pending'
      }
    }
    
    this.cardForm = this.formBuilder.group(card);
  }
  openCard(content, card, type) {
    this.initCardModal(card, type);

    this.modalService.open(content).result.then((result) => {
      if(result === 'onOk') {
        const curCard = { status: 'open', ...this.cardForm.value};
        
        if (type === 'edit') {
          this.editCard(curCard);
        } else if (type === 'new') {
          // this.newCard(curCard);
        }
        
        this.searchStatus();
      }
    }, (reason) => {

    })
  }
  // newCard(curCard) {
  //   // todo add card todo hash todo status
  //   const addPost = this.service.addPost;
  //   const cardsRef = this.db.collection('cards');

  //   cardsRef.add(curCard)
  //     .then(docRef => {
  //       console.log("add card success ref: ", docRef);
  //       const { bounty, cost } = curCard;

  //       addPost(bounty, cost);
  //       return docRef.id;
  //     })
  //     .then(
  //       (id) => {
  //         cardsRef.doc(id).update({ status: 'open' })},
  //       (id) => {
  //         cardsRef.doc(id).update({ status: 'failed' })
  //       }
  //     )
  //     .catch(function(error) {
  //       console.error("error: ", error);
  //     });

  //   this.cards = this.cards.concat(curCard);
  // }
  editCard(curCard) {
    // todo update card
    const nextCards = this.cards.map(card => {
      if(card.id === curCard.id) {
        return { ...card, ...curCard };
      }
      return card;
    });
    this.cards = nextCards;
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

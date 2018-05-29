import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../model/card';
import { CardService } from '../service/card.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Candidate } from '../model/candidate';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  // public radioGroupForm: FormGroup;
  cards: Card[];
  results: Card[];
  code = 0;
  statusArr = ['open', 'closed', 'cancelled'];

  // new or edit a card
  Card: Card;
  type: string = 'new';

  // new or list candidate
  Candidate: Candidate;
  email: string;

  // cur user address
  curUser = '0x0';

  constructor(private cardService: CardService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getCards();
  }
  getCards(): void {
    this.results = this.cards = this.cardService.getCards();
  }
  searchStatus() {
    const { cards, code, statusArr } = this;
    const next = cards.filter(item => item.status === statusArr[code]);
    this.results = next;
  }
  open(content, card) {
    this.Card = card;
    this.type = 'edit';
    
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

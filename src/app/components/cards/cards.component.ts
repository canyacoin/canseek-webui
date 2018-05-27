import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { Card } from '../model/card';
import { CardService } from '../service/card.service';

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


  constructor(private cardService: CardService) { }

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
}

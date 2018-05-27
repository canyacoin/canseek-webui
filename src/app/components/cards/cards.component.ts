import { Component, OnInit } from '@angular/core';
import { Card } from '../model/card';
import { CardService } from '../service/card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cards: Card[];

  constructor(private cardService: CardService) { }

  ngOnInit() {
    this.getCards();
  }
  getCards(): void {
    this.cards = this.cardService.getCards();
  }
}

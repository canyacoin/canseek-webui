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
  code = 0;
  statusArr = ['open', 'closed', 'canceled'];


  constructor(private cardService: CardService) { }

  ngOnInit() {
    this.getCards();
  }
  getCards(): void {
    this.cards = this.cardService.getCards();
  }
}

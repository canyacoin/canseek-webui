import { Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Cards } from '../mock/cards';

@Injectable()
export class CardService {

  constructor() { }

  getCards(): Card[] {
    return Cards;
  }

  getCard(id: number): Card {
    return Cards.find(Card => Card.id === id);
  }

}

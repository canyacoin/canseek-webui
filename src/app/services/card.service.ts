import { Injectable } from '@angular/core';
import { Card } from '../components/model/card';
import { Cards } from '../components/mock/cards';

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

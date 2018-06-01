import { Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Candidate } from '../model/candidate';
import { ContractsService } from '../../services/contracts/contracts.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { Cards } from '../mock/mock-cards';

@Injectable()
export class CardService {
  cards: Card[];
  constructor(private contractsService: ContractsService,
              private db: AngularFirestore) { }

  getCards(): Observable<Card[]> {
    this.db.collection('cards').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc);
      });
  });
    return of(Cards);
  }
  addCard(card: Card) {

  }
  updateCard(card: Card) {

  }
  addCandidate(candidate: Candidate) {

  }
}

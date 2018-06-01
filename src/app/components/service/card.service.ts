import { Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Candidate } from '../model/candidate';
import { ContractsService } from '../../services/contracts/contracts.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';

@Injectable()
export class CardService {
  constructor(private contractsService: ContractsService,
              private db: AngularFirestore
            ) { }
  dbRef: any = this.db.collection('cards');

  getCards(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  addCard(card: Card) {
    this.dbRef.add(card)
      .then(function(docRef) {
        return docRef.id;
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }
  updateCard(card: Card) {

  }
  addCandidate(candidate: Candidate) {

  }
}

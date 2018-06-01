import { Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Candidate } from '../model/candidate';
import { ContractsService } from '../../services/contracts/contracts.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';

@Injectable()
export class CardService {
  constructor(private cs: ContractsService,
              private db: AngularFirestore
            ) { }
  dbRef: any = this.db.collection('cards');
  docRef: any;

  getCards(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  addCard(card: Card) {
    this.dbRef.add(card)
      .then(docRef => {
        this.docRef = docRef;
        console.log('add success, ref: ', docRef);

        const { bounty, cost } = card;

        docRef.update({
          id: docRef.id
        });

        return this.cs.addPost(docRef.id, bounty, cost);
      })
      .then((postId) => {
        this.docRef.update({
          status: postId ? 'open' : 'pending',
          postId
        })
        console.log('add to block chain succ: ', postId);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  }
  updateCard(card: Card) {
    const { id } = card;
    this.dbRef.doc(id).update(card)
    .catch(err => {
      console.error(err);
    })
  }
  cancelPost(postId: number) {
    this.cs.cancelPost(postId).then(
      args => console.log('cancelPost succ: ', args)
    )
  }
  addCandidate(card: Card, candidate: Candidate) {
    this.cs.recommend(card.postId).then(
      args => console.log(args)
    )
    // const { candidates = [] } = card;
    // const nextCandidates = candidates.concat(candidate);
    // this.dbRef.doc(card.id).update({
    //   candidates: nextCandidates
    // });
  }
  updateStatus(id: string) {
    // todo firestore
    this.cs.getPostId(id)
      .then(args => console.log('query result: ', args))
  }
}

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
  getCandidates(cardId): Observable<any[]> {
    return this.dbRef.doc(cardId).collection('candidates').valueChanges();
  }

  addCard(card: Card) {
    this.dbRef.add(card)
      .then(docRef => {
        const { bounty, cost } = card;
        
        this.docRef = docRef;
        this.docRef.update({
          id: docRef.id,
        });
        console.log(`add succ: ${docRef.id}`);
        return this.cs.addPost(docRef.id, bounty, cost);
      })
      .then((postId) => {
        this.docRef.update({
          status: postId ? 'open' : 'pending',
          postId
        })
        console.log('add to block chain succ: ', postId);
      })
      .catch(function(err) {
          console.error(`add err ${err}`);
      });
  }

  updateCard(card: Card) {
    const { id } = card;
    this.dbRef.update({card})
  }

  cancelCard(card: Card) {
    const { postId, id, nextStatus } = card;
    this.cs.cancelPost(postId)
      .then(result => {
        console.log(`cancel result: ${result}`);
        this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending'
        })
      })
      .catch(err => console.log(`cancel err: ${err}`));
  }

  updateCardStatus(card: Card) {
    const { postId, id, nextStatus } = card;
    this.cs.getPostId(postId)
      .then(result => {
        console.log(`update card status result: ${result}`)
        this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending'
        })
      })
    this.dbRef.doc(id).update(card)
      .catch(err => {
        console.error(`update err: ${err}`);
      })
  }

  addCandidate(card: Card, candidate: Candidate) {
    const { id, postId, candidates = 0 } = card;

    console.log(`candidates: ${candidates}`);
    // console.log(`will add candidate ${JSON.stringify(candidate)} to card ${JSON.stringify(card)}`);
    this.dbRef.doc(id).collection('candidates').add(candidate)
      .then(docRef => {
        console.log(`add candidate succ: ${docRef.id}`);
        this.docRef = docRef;
        this.docRef.update({
          id: docRef.id,
        })
        this.dbRef.doc(id).update({
          candidates: candidates + 1
        })
        return this.cs.recommend(postId, docRef.id);
      })
      .then(result => {
        this.docRef.update({
          candidateId: result,
          status: result ? 'ok' : 'pending'
        })
      })
      .catch(err => console.log(`add candidate err: ${err}`))
  }

  updateCandidateStatus(card: Card, candidate: Candidate) {
    const { id, postId } = card;
    const { id: cid, candidateId } = candidate;
    this.cs.updateCandidateStatus(postId, candidateId)
      .then(result => {
        console.log(`update candidate status succ: ${candidateId}`);
        this.dbRef.doc(id).collection('candidates').doc(cid).update({
          status: result ? 'ok' : 'pending'
        })
      })
  }
}

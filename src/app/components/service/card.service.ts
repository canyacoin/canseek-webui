import { Injectable } from '@angular/core';
import { Card } from '../model/card';
import { Candidate } from '../model/candidate';
import { ContractsService } from '../../services/contracts/contracts.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of } from 'rxjs';
import { CONSTANTS } from '@firebase/util';
import { identifierModuleUrl, ResourceLoader } from '@angular/compiler';

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
    this.dbRef.doc(id).update(card)
      .catch(err => {
        console.error(`update err: ${err}`);
      })
  }

  cancelCard(card: Card) {
    const { postId, id, nextStatus } = card;
    this.cs.cancelPost(postId)
      .then(result => {
        console.log(`cancel result: ${result}`);
        this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending',
          nextStatus
        })
      })
      .catch(err => console.error(`cancel err: ${err}`));
  }

  updateCardStatus(card: Card) {
    const { postId, id } = card;
    const cardRef = this.dbRef.doc(id);
    
    if (postId) {
      this.cs.getPostStatus(postId) 
        .then(result => {
          cardRef.update({
            status: result
          })
        })
        .catch(err => console.log(`get post status err: ${err}`))
    } else {
      this.cs.getPostId(id)
        .then(postId => {
          cardRef.update({
            postId,
            status: 'open'
          })
        })
        .catch(err => console.error(`get post id err: ${err}`))
    }
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
        return this.cs.recommend(docRef.id, postId);
      })
      .then(candidateId => {
        this.docRef.update({
          candidateId,
          status: candidateId ? 'ok' : 'pending'
        })
      })
      .catch(err => console.error(`add candidate err: ${err}`))
  }
  updateCandidateStatus(card: Card, candidate: Candidate) {
    const { postId, id } = card;
    const { id: cid } = candidate;
    const cardRef = this.dbRef.doc(id);
    const candidateRef = cardRef.collection('candidates').doc(cid);

    this.cs.getCandidateId(cid, postId)
      .then(candidateId => {
        candidateRef.update({
          candidateId,
          status: 'ok'
        })
      })
      .catch(err => console.error(`get candidate id err: ${err}`))
  }
  
  closePost(card: Card, candidate: Candidate) {
    const { id, postId, nextStatus } = card;
    const { id: cid, candidateId } = candidate;
    this.cs.closePost(postId, candidateId)
      .then(result => {
        console.log(`close post succ: ${result}`);
        this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending',
          nextStatus
        });
        this.dbRef.doc(id).collection('candidates').doc(cid).update({
          status: result ? 'chosed' : 'pending',
        })
      })
      .catch(err => console.error(`closepost err: ${err}`))
  }
}

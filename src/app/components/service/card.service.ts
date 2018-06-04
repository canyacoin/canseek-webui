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
    const { id, bounty, cost } = card;

    if (id) {// retry add
      this.docRef = this.dbRef.doc(id);
      this.docRef.update(card);
      this.cs.addPost(id, bounty, cost)
        .then(postId => {
          this.docRef.update({
            postId,
            status: postId ? 'open' : 'pending'
          })
        })
    } else {
      this.dbRef.add(card)
        .then(docRef => {
          this.docRef = docRef;
          docRef.update({id: docRef.id});
          return this.cs.addPost(docRef.id, bounty, cost);
        })
        .then(postId => {
          this.docRef.update({
            postId,
            status: postId ? 'open' : 'pending'
          })
        })
    }
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
          console.log(`get post status ${result} with postId: ${postId}`);
          cardRef.update({
            status: result
          })
        })
        .catch(err => console.log(`get post status err: ${err}`))
    } else {
      this.cs.getPostId(id)
        .then(postId => {
          if (!postId) {
            alert('update error, please retry to add this post');
          } else {
            cardRef.update({
              postId,
              status: 'open'
            })
          }
        })
        .catch(err => console.error(`get post id err: ${err}`))
    }
  }

  addCandidate(card: Card, candidate: Candidate) {
    const { id, postId, candidates = 0 } = card;
    const { id: cid } = candidate;

    if (cid) {// retry
      this.docRef = this.dbRef.doc(id).collection('candidates').doc(cid);
      this.cs.recommend(cid, postId)
        .then(candidateId => {
          this.docRef.update({
            candidateId,
            status: candidateId ? 'ok' : 'pending'
          })
        })
    } else {
      this.dbRef.doc(id).collection('candidates').add(candidate)
        .then(docRef => {
          this.docRef = docRef;
          docRef.update({id: docRef.id});
          // card candidates + 1
          this.dbRef.doc(id).update({
            candidates: candidates + 1,
          });
          return this.cs.recommend(docRef.id, postId);
        })
        .then(({ honeyPot, candidateId}) => {
          // update honeypot
          this.dbRef.doc(id).update({
            honeyPot,
          });
          this.docRef.update({
            candidateId,
            status: candidateId ? 'ok' : 'pending'
          })
        })
    }
  }
  updateCandidateStatus(card: Card, candidate: Candidate) {
    const { postId, id } = card;
    const { id: cid } = candidate;
    const cardRef = this.dbRef.doc(id);
    const candidateRef = cardRef.collection('candidates').doc(cid);

    this.cs.getCandidateId(cid, postId)
      .then(candidateId => {
        if(!candidateId) {
          alert('update error, please retry to add this candidate');
        } else {
          candidateRef.update({
            candidateId,
            status: 'ok'
          })
        }
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

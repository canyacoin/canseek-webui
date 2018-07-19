import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { ContractsService } from './contracts/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  dbRef: any = this.db.collection('posts');
  postRef: any;

  change: EventEmitter<string>;

  constructor(
    private db: AngularFirestore,
    private cs: ContractsService,
  ) { 
    this.change = new EventEmitter();
  }

  getPosts(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  getPost(id): Observable<any[]> {
    return this.dbRef.doc(id).valueChanges();
  }
  
  addPost(post: any) {
    const { reward, cost } = post;

    return this.dbRef.add(post)
        .then(docRef => {
          docRef.update({id: docRef.id})
          this.postRef = docRef;
        })
        .then(
          () => this.cs.addPost(this.postRef.id, reward, cost)
        )
        .then(postId => {
          this.postRef.update({
            postId,
            status: postId ? 'open' : 'pending'
          })

          return Promise.resolve({
            status: 'open',
            id: this.postRef.id
          });
        })
  }

  updatePost(post: any) {
    const { id } = post;

    this.dbRef.doc(id).update(post);
  }

  cancelPost(post: any) {
    const { postId, id, nextStatus } = post;

    return this.cs.cancelPost(postId)
      .then(result => {
        return this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending',
          nextStatus
        })
      })
  }

  addCandidate(post: any, candidate: any) {
    const { id, postId, candidates = 0, referrals_by_user = {} } = post;
    const { owner_addr: curUser } = candidate;
    let cid, candidateRef;
    
    this.postRef = this.dbRef.doc(id);

    return this.postRef.collection('candidates').add(candidate)
      .then(docRef => {
        cid = docRef.id;
        docRef.update({id: cid});

        candidateRef = docRef;
        // update post in order to find transaction again
        if (referrals_by_user[curUser]) {
          referrals_by_user[curUser] = referrals_by_user[curUser].concat(cid);
        } else {
          referrals_by_user[curUser] = [cid];
        }
        this.postRef.update({ candidates: candidates + 1, referrals_by_user })
      })
      .then(
        () => this.cs.recommend(cid, postId)
      )
      .then(({ honeypot, candidateId }) => {
        if (candidateId) {
          // update candidate-ref candidateId & status
          candidateRef.update({candidateId, status: 'ok'});
          // update post-ref honeypot
          this.postRef.update({honeypot});

          return Promise.resolve({id: cid})
        }
      })
  }

  getCandidates(pid: string): Observable<any[]> {
    return this.dbRef.doc(pid).collection('candidates').valueChanges();
  }

  getCandidate(pid: string, cid: string) {
    return this.dbRef.doc(pid).collection('candidates').doc(cid).valueChanges();
  }

  getRefund(post: any, curUser: string) {
    const { id, postId, referrals_by_user, candidates } = post;
    const cidArr = referrals_by_user[curUser];
    const referNum = cidArr.length;
    const postRef = this.dbRef.doc(id);
    debugger
    this.cs.getRefund(postId)
      .then(result => {
        if (result) {
          // update post's referrals_by_user candidates
          delete referrals_by_user[curUser];
          postRef.update({ candidates: candidates - referNum, referrals_by_user })

          // update candidatesRef
          cidArr.map(cid => {
            postRef.collection('candidates').doc(cid).delete();
            // postRef.collection('candidates').doc(cid).update({status: 'deleted'});
          })
        // } else {
        //   // update post's status nextStatus
        //   postRef.update({ status: 'pending', nextStatus: 'getRefund' })
        }
      })
      // .catch(() => {
      //   postRef.update({ status: 'pending', nextStatus: 'getRefund' })
      // })
  }
}

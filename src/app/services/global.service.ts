import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { ContractsService } from './contracts.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import qs from 'qs';

const { URL } = environment;

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  dbRef: any = this.db.collection('posts');
  postRef: any;

  change: EventEmitter<string>;

  constructor(
    private db: AngularFirestore,
    private cs: ContractsService,
    private message: NzMessageService,
  ) { 
    this.change = new EventEmitter();
  }

  async changeCurrency(currency): Promise<any> {
    return await fetch(`${URL.changeCurrency}?${qs.stringify(currency)}`)
      .then(response => response.json())
      .catch(err => this.message.error(err.message);console.log(err););
  }

  getPosts(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  getPost(id): Observable<any[]> {
    return this.dbRef.doc(id).valueChanges();
  }
  
  addPostDb(post: any): Promise<any> {
    return this.dbRef.add(post)
      .then(docRef => {
        docRef.update({id: docRef.id, status: 'pending'})
        return Promise.resolve(docRef.id)
      })
  }

  addPostCb(id, postId): Promise<any> {
    return this.dbRef.doc(id).update({postId, status: 'open'});
  }

  updatePost(post: any): Promise<any> {
    const { id } = post;

    return this.dbRef.doc(id).update(post);
  }

  cancelPostDb(post: any) {
    const { id } = post;

    return this.dbRef.doc(id).update({
      status: 'pending',
      nextStatus: 'pending',
    })
    .then(() => {
      Promise.resolve()
    })
  }

  cancelPost(post: any) {
    const { postId, id, nextStatus } = post;

    return this.cs.cancelPost(postId)
      .then(result => {
        return this.dbRef.doc(id).update({
          status: result ? nextStatus : 'pending',
          nextStatus
        });
      })
  }

  addCandidateDb(post: any, candidate: any): Promise<any> {
    const { id, candidateTrend = 0, referrals_by_user } = post;
    const { owner_addr: curUser } = candidate;
    const postRef = this.dbRef.doc(id);

    return postRef.collection('candidates').add(candidate)
      .then(docRef => {
        const cid = docRef.id;

        docRef.update({ id: cid, status: 'pending' })

        referrals_by_user[curUser] = (referrals_by_user[curUser] || []).concat(cid);
        postRef.update({ candidateTrend: candidateTrend + 1, referrals_by_user })

        return Promise.resolve(cid);
      })
  }

  updatePostAndCandidate(post: any, candidtae: any, res: any): Promise<any> {
    const { honeypot, candidateId } = res;
    if(candidateId) {
      const { id: pid, cost, reward } = post;
      const { id: cid, nextStatus = 'open' } = candidtae;
      const postRef = this.dbRef.doc(pid);
      const candidateRef = postRef.collection('candidates').doc(cid);
      const candidates = (Number(honeypot) - Number(reward)) / Number(cost);
  
      postRef.update({candidates, honeypot });
      candidateRef.update({candidateId, status: nextStatus});
      
      return Promise.resolve();
    } else {
      throw new Error('Oops error! Candidate didn\'t add success');
    }
  }

  getCandidates(pid: string): Observable<any[]> {
    return this.dbRef.doc(pid).collection('candidates').valueChanges();
  }

  getCandidate(pid: string, cid: string) {
    return this.dbRef.doc(pid).collection('candidates').doc(cid).valueChanges();
  }

  getRefund(post: any, curUser: string) {
    const { id, postId, referrals_by_user, candidates, honeypot, cost } = post;
    const cidArr = referrals_by_user[curUser] || [];
    const referNum = cidArr.length;
    const postRef = this.dbRef.doc(id);

    this.cs.getRefund(postId)
      .then(result => {
        if (result) {
          // update post's referrals_by_user candidates
          delete referrals_by_user[curUser];
          postRef.update({ 
            candidates: Number(candidates) - referNum, 
            honeypot: Number(honeypot) - Number(cost) * referNum, 
            referrals_by_user 
          })

          // update candidatesRef
          cidArr.map(cid => {
            postRef.collection('candidates').doc(cid).delete();
            // postRef.collection('candidates').doc(cid).update({status: 'deleted'});
          })
          this.message.success('GetRefund success');
        }
      })
      .catch(err => {
        this.message.error(err.message);console.log(err);
      })
  }

  updatePostStatus(post) {
    const { postId, id } = post;
    const postRef = this.dbRef.doc(id);
    
    if (postId) {
      return this.cs.getPostStatus(postId) 
        .then(status => {
          postRef.update({ status })
          Promise.resolve(status);
        })
    } else {
      return this.cs.getPostId(id)
        .then(postId => {
          if (postId) {
            postRef.update({
              postId,
              status: 'open'
            })
            Promise.resolve(status);
          } else {
            throw new Error('Post didn\'t exist!');
          }
        })
        .catch(err => {
          throw err;
        })
    }
  }

  // include callback after status updated
  updateCandidateStatus(post, candidate) {
    const { postId } = post;
    const { id: cid } = candidate;

    return this.cs.getCandidateId(cid, postId)
      .then(({candidateId}) => this.updatePostAndCandidate(post, candidate, candidateId))
      .catch(err => {
        throw err;
      })
  }

  changeCandidateCat(pid, cid, category) {
    this.dbRef.doc(pid).collection('candidates').doc(cid).update({category});
  }

  closePost(post: any, cid: string, candidateId: number) {
    const { id, postId, nextStatus } = post;
    const postRef = this.dbRef.doc(id);
    const candidateRef = postRef.collection('candidates').doc(cid);

    return this.cs.closePost(postId, candidateId)
      .then(result => {
        postRef.update({
          status: result ? nextStatus : 'pending',
          nextStatus
        });
        candidateRef.update({
          status: result ? 'selected' : 'pending',
          nextStatus: 'selected'
        })
        return Promise.resolve({result});
      })
  }
}

import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { ContractsService } from './contracts/contracts.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

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
    private message: NzMessageService,
    private router: Router,
  ) { 
    this.change = new EventEmitter();
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
    // todo
    return this.dbRef.doc(id).update(post)
            .then(() => id)
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

  timeoutRace(obj, timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(obj), timeout)
    })
  }

  addCandidateDb(post: any, candidate: any): Promise<any> {
    const { id, candidates = 0, referrals_by_user } = post;
    const { owner_addr: curUser } = candidate;
    const postRef = this.dbRef.doc(id);

    return postRef.collection('candidates').add(candidate)
      .then(docRef => {
        const cid = docRef.id;

        docRef.update({ id: cid, status: 'pending' })

        referrals_by_user[curUser] = (referrals_by_user[curUser] || []).concat(cid);
        postRef.update({ referrals_by_user })

        return Promise.resolve(cid);
      })
  }

  addCandidateCb(post: any, cid: string, res: any): Promise<any> {
    const {honeypot, candidateId} = res;
    const { id: pid, candidates = 0 } = post;
    const postRef = this.dbRef.doc(pid);
    const candidateRef = postRef.collection('candidates').doc(cid);

    postRef.update({candidates: candidates + 1, honeypot});
    candidateRef.update({candidateId, status: 'open'});
    
    return Promise.resolve();
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
            Promise.reject(false);
          }
        })
        .catch(err => {
          console.log(err);
          Promise.reject(false);
        })
    }
  }

  updateCandidateStatus(post, candidate) {
    const { postId, id: pid } = post;
    const { candidateId, id: cid } = candidate;
    const postRef = this.dbRef.doc(pid);
    const candidateRef = postRef.collection('candidates').doc(cid);
    
    if (candidateId) {
      alert('update existed candidates status, todo');
      // this.cs.getPostStatus(postId) 
      //   .then(status => {
      //     postRef.update({ status })
      //   })
    } else {
      return this.cs.getCandidateId(cid, postId)
        .then(candidateId => {
          if (candidateId) {
            candidateRef.update({
              candidateId,
              status: 'open'
            })
            Promise.resolve('open');
          }
        })
        .catch(err => {
          console.log(err);
          Promise.reject(false);
        })
    }
  }

  changeCandidateStatus(pid, cid, status) {
    const candidateRef = this.dbRef.doc(pid).collection('candidates').doc(cid);

    candidateRef.update({status});
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
        })
        return Promise.resolve({result});
      })
  }
}

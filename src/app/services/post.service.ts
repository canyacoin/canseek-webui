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

  updateStatus(post) {
    const { postId, id } = post;
    const postRef = this.dbRef.doc(id);
    
    if (postId) {
      this.cs.getPostStatus(postId) 
        .then(result => {
          postRef.update({
            status: result
          })
        })
    } else {
      this.cs.getPostId(id)
        .then(postId => {
          if (!postId) {
            this.message.warning('please re-add this post, will redirect in 3 seconds');
            setTimeout(
              () => this.router.navigateByUrl(`post?type=edit&id=${id}`),
              3000
            )
          } else {
            postRef.update({
              postId,
              status: 'open'
            })
          }
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

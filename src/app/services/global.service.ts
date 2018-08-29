import { Injectable, EventEmitter } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { ContractsService } from './contracts.service';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '@env/environment';
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
    // this.delPending();
  }

  async changeCurrency(currency): Promise<any> {
    return await fetch(`${URL.changeCurrency}?${qs.stringify(currency)}`)
      .then(response => response.json())
      .catch(err => {
        this.message.error(err.message);console.log(err);
      });
  }

  getPosts(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  getPost(id): Observable<any[]> {
    return this.dbRef.doc(id).valueChanges();
  }
  
  delPending() {
    this.getPosts()
      .subscribe(posts => {
        posts
          .filter(post => post.id && post.status === 'pending')
          .map(post => this.dbRef.doc(post.id).delete())
      })
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

  // update post's pending candidates before cancel post
  cancelPostPre(post) {
    return new Promise((resolve, reject) => {
      this.dbRef
        .doc(post['id'])
        .collection('candidates')
        .valueChanges()
        .subscribe(candidates => {
          candidates
            .filter(c => c.status == 'pending')
            .map(c => this.updatePendingCandidate(post, c))

            resolve(1);
        })
    });
    
  }

  addCandidateDb(post: any, candidate: any): Promise<any> {
    const { id, candidateTrend = 0 } = post;
    const postRef = this.dbRef.doc(id);

    return postRef.collection('candidates').add(candidate)
      .then(docRef => {
        const cid = docRef.id;

        docRef.update({ id: cid, status: 'pending' })

        postRef.update({ candidateTrend: candidateTrend + 1 })

        return Promise.resolve(cid);
      })
  }

  updatePostAndCandidate(post: any, curUser: string, candidtae: any, res: any): Promise<any> {
    const { honeypot, candidateId } = res;

    if(candidateId) {
      const { id: pid, cost, reward, referrals_by_user } = post;
      const { id: cid, nextStatus = 'open' } = candidtae;
      const postRef = this.dbRef.doc(pid);
      const candidateRef = postRef.collection('candidates').doc(cid);
      const candidates = (Number(honeypot) - Number(reward)) / Number(cost);
  
      referrals_by_user[curUser] = (referrals_by_user[curUser] || []).concat(cid);
      postRef.update({candidates, honeypot, referrals_by_user });
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
  delCandidatePending(pid: string, cid: string) {
    this.dbRef.doc(pid).collection('candidates').doc(cid).delete();
  }

  getRefund(post: any, curUser: string) {
    const { id, postId, referrals_by_user, candidates, honeypot, cost } = post;
    const cidArr = referrals_by_user[curUser] || [];
    const referNum = cidArr.length;
    const postRef = this.dbRef.doc(id);

    return this.cs.getRefund(postId)
      .then(result => {
        if (result) {
          // update post's referrals_by_user candidates
          delete referrals_by_user[curUser];
          postRef.update({ 
            candidates: Number(candidates) - referNum, 
            honeypot: Number(honeypot) - Number(cost) * referNum, 
            referrals_by_user 
          });

          // update candidatesRef
          cidArr.map(cid => {
            postRef.collection('candidates').doc(cid).delete();
            // postRef.collection('candidates').doc(cid).update({status: 'deleted'});
          })
          // this.message.success('GetRefund success');
          return Promise.resolve(1);
        }
      })
      .catch(err => {
        this.message.error(err.message);console.log(err);
      })
  }

  updatePendingPost(post) {
    const { postId, id, nextWinner } = post;
    
    if (!id) return Promise.reject(0);;

    const postRef = this.dbRef.doc(id);
    
    if (postId) {
      return this.cs.getPostStatus(postId) 
        .then(status => {
          postRef.update({ status, winner: status == 'closed' ? nextWinner : '' })
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
  updatePendingCandidate(post, candidate) {
    const { postId } = post;
    const { id: cid, owner_addr: curUser } = candidate;

    return this.cs.getCandidateId(cid, postId)
      .then((res) => {this.updatePostAndCandidate(post, curUser, candidate,res)})
      .catch(err => {
        throw err;
      })
  }

  changeCandidateCat(pid, cid, category) {
    this.dbRef.doc(pid).collection('candidates').doc(cid).update({category});
  }

  closePostDb(pid: string, cid: string) {
    return this.dbRef.doc(pid).update({
      status: 'pending',
      nextStatus: 'closed',
      nextWinner: cid,
    })
    .then(() => {
      Promise.resolve()
    })
  }

  closePost(post: any, cid: string, candidateId: number) {
    const { id, postId, nextStatus } = post;
    const postRef = this.dbRef.doc(id);
    const candidateRef = postRef.collection('candidates').doc(cid);

    return this.cs.closePost(postId, candidateId)
      .then(result => {
        postRef.update({
          status: result ? nextStatus : 'pending',
          winner: result ? cid : '',
        });
        candidateRef.update({
          status: result ? 'selected' : 'open',
        })
        return Promise.resolve({result});
      })
  }
}

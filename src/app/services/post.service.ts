import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';
import { ContractsService } from './contracts/contracts.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  dbRef: any = this.db.collection('posts');
  postRef: any;

  constructor(
    private db: AngularFirestore,
    private cs: ContractsService,
  ) { }

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

  deletePost(id: string) {
    return this.dbRef.doc(id).delete()
  }

  addCandidate(post: any, candidate: Object, curUser: string) {
    const { id, candidates = 0, referrals_by_user = {} } = post;
    this.postRef = this.dbRef.doc(id);

    return this.postRef.collection('candidates').add(candidate)
      .then(docRef => {
        const cid = docRef.id;
        docRef.update({id: cid});

        // post candidates ++
        if (referrals_by_user[curUser]) {
          referrals_by_user[curUser] = referrals_by_user[curUser].concat(cid);
        } else {
          referrals_by_user[curUser] = [cid];
        }
        this.postRef.update({ candidates: candidates + 1, referrals_by_user })

        // send bc request
        // this.cs.recommend(candidateRef.id, id);
        
        return Promise.resolve({
          pid: id,
          cid
        })
      })
  }

  getCandidates(pid: string): Observable<any[]> {
    return this.dbRef.doc(pid).collection('candidates').valueChanges();
  }

  getCandidate(pid: string, cid: string) {
    return this.dbRef.doc(pid).collection('candidates').doc(cid).valueChanges();
  }
}

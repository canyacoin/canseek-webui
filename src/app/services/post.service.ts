import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  dbRef: any = this.db.collection('posts');
  docRef: any;

  constructor(
    private db: AngularFirestore,
  ) { }

  getPosts(): Observable<any[]> {
    return this.dbRef.valueChanges();
  }
  getPost(id): Observable<any[]> {
    return this.dbRef.doc(id).valueChanges();
  }

  addPost(post: any) {
    const { id, bounty, cost } = post;

    return this.dbRef.add(post)
      .then(docRef => {
        const { id } = docRef;

        this.docRef = docRef;
        // todo status intergrate with contracts
        docRef.update({ id, status: 'open' });

        return Promise.resolve({
          status: 'open',
          id
        });

      })
  }
}

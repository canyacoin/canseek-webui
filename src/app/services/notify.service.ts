import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Notify } from '@class/notify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  dbRef = this.db.collection<Notify>('notifications');
  constructor(
    private db: AngularFirestore,
  ) { }

  getNotifications(user_addr): Observable<Notify[]> {
    return this.db
      .collection<Notify>('notifications',
        ref => ref
          .where('user', '==', user_addr.toLowerCase())
          .orderBy('time', 'desc')
      )
      .valueChanges();
  }

  getNotification(id: string): Observable<Notify> {
    return this.db
      .collection<Notify>('notifications')
      .doc<Notify>(id)
      .valueChanges();
  }

  async notify(notification: Notify): Promise<boolean> {
    const docRef = await this.dbRef.add(notification);
    docRef.update({id: docRef.id});
    return Promise.resolve(!!docRef.id);
  }

  getUnreadNotifications(user_addr): Observable<Notify[]> {
    return this.db
      .collection<Notify>('notifications',
        ref => ref
          .where('user', '==', user_addr.toLowerCase())
          .where('is_read', '==', false)
          .orderBy('time', 'desc')
      )
      .valueChanges();
  }

  readAll(user_addr) {
    this.getNotifications(user_addr)
      .subscribe(
        list => list.map(li => this.dbRef.doc<Notify>(li.id).update({is_read: true}))
      );
  }

  read(nid: string) {
    this.dbRef.doc(nid).update({is_read: true});
  }
}

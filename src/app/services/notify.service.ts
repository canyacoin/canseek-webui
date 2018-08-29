import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Notify } from '../models/notify';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

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
      .collection('notifications')
      .doc<Notify>(id)
      .valueChanges()
  }

  async notify(notification: Notify): Promise<boolean> {
    const docRef = await this.db.collection('notifications').add(notification);
    docRef.update({id: docRef.id});
    return Promise.resolve(!!docRef.id);
  }

  hasUnreadNotify(user_addr): Observable<Notify[]> {
    return this.db
      .collection<Notify>('notifications', 
        ref => ref
          .where('is_read', '==', false)
      )
      .valueChanges();
  }
}

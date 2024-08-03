import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireObject,
} from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { AppUser } from '../models/app-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}

  save(user: firebase.User) {
    const userData = {
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
    };

    this.db
      .object('/users/' + user.uid)
      .update(userData)
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  }

  get(uid: string): AngularFireObject<AppUser> {
    return this.db.object('/users/' + uid);
  }
}

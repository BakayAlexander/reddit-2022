import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

//This cloud function gives opportunity to add user permanently to db when we sign up as a new user. Surprisingly this is not necessary to implement this function anywhere at the code, it's just work by itself!) Firebase <3
export const createUserDocument = functions.auth.user().onCreate(async user => {
  db.collection('users')
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});

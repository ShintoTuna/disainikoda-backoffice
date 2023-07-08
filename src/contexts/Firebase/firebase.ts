import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { UserWithRoles, Config } from '../../types';

const config = {
  apiKey: 'AIzaSyBcWr_GvqN-8nAiAvyTgnebYpTO0CTRmog',
  authDomain: 'disainikoda-backoffice.firebaseapp.com',
  projectId: 'disainikoda-backoffice',
  storageBucket: 'disainikoda-backoffice.appspot.com',
};

class Firebase {
  auth: app.auth.Auth;
  db: app.firestore.Firestore;
  storage: app.storage.Storage;
  config: Config | null = null;

  constructor() {
    app.initializeApp(config);
    console.log('Firebase initialized');

    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: string) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password: string) => this.auth.currentUser && this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next: (u: UserWithRoles) => void, fallback?: () => void) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot) => {
            const dbUser = snapshot.data() || {};
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            const userWithRoles = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(userWithRoles as UserWithRoles);
          });

        this.db.collection('config').onSnapshot((snapshot) => {
          let agg = {};

          snapshot.forEach((doc) => {
            agg = { ...agg, ...{ [doc.id]: doc.data() } };
          });
          this.config = agg as Config;
        });
      } else if (fallback) {
        this.config = null;
        fallback();
      }
    });

  getTimestamp = () => app.firestore.FieldValue.serverTimestamp();

  setNewInvoiceId = (lastId: number) =>
    this.db
      .collection('config')
      .doc('invoice')
      .set({ lastId }, { merge: true });

  // *** User API ***
  user = (uid: string) => this.db.doc(`users/${uid}`);
  users = () => this.db.collection('users');

  // *** Students API ***
  student = (uid: string) => this.db.doc(`student/${uid}`);
  students = () => this.db.collection('student');

  // *** Groups API ***
  groups = () => this.db.collection('groups');

  // *** Invoice API ***
  invoice = (id: string) => this.db.doc(`invoice/${id}`);
  invoices = () => this.db.collection('invoice');
}
export default Firebase;

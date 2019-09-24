import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { UserWithRoles } from '../../types/indexd';

const config = {
    apiKey: 'AIzaSyBcWr_GvqN-8nAiAvyTgnebYpTO0CTRmog',
    authDomain: 'disainikoda-backoffice.firebaseapp.com',
    projectId: 'disainikoda-backoffice',
};

class Firebase {
    auth: app.auth.Auth;
    db: app.firestore.Firestore;

    constructor() {
        app.initializeApp(config);
        console.log('Firebase initialized');

        this.auth = app.auth();
        this.db = app.firestore();
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
    onAuthUserListener = (next: (u: UserWithRoles) => void, fallback: () => void) =>
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
                        // merge auth and db user
                        const userWithRoles = {
                            uid: authUser.uid,
                            email: authUser.email,
                            ...dbUser,
                        };
                        next(userWithRoles as UserWithRoles);
                    });
            } else {
                fallback();
            }
        });

    // *** User API ***
    user = (uid: string) => this.db.doc(`users/${uid}`);
    users = () => this.db.collection('users');

    // *** Orders API ***
    order = (uid: string) => this.db.doc(`orders/${uid}`);
    orders = () => this.db.collection('orders');
}
export default Firebase;

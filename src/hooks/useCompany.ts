import { FirebaseContext } from 'contexts/Firebase';
import { useContext } from 'react';

export const useCompany = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = firebase.auth.currentUser;

  if (authUser) {
    firebase
      .user(authUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No such document!');
        }
      });
  }

  return {};
};

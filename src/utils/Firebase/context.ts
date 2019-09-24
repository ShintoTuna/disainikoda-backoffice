import React from 'react';
import Firebase from './firebase';

export const firebaseState = new Firebase();

export default React.createContext<Firebase>(firebaseState);

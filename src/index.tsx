import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { FirebaseContext, firebaseState } from './utils/Firebase';
import './index.css';

ReactDOM.render(
    <FirebaseContext.Provider value={firebaseState}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root'),
);

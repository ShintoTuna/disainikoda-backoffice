import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { FirebaseContext, firebaseState } from './contexts/Firebase';
import './index.css';
import { ConfigContextProvider } from './contexts/Config';

ReactDOM.render(
    <FirebaseContext.Provider value={firebaseState}>
        <ConfigContextProvider>
            <App />
        </ConfigContextProvider>
    </FirebaseContext.Provider>,
    document.getElementById('root'),
);

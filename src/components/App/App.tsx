import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../Navigation';
import { FirebaseContext } from '../../contexts/Firebase';
import { AuthUserContext } from '../../contexts/Session';
import Router from '../Router';
import { useTheme } from '../../utils/theme';
import s from './App.module.css';
import { UserWithRoles } from '../../types';

const App = () => {
    const savedUser = JSON.parse(localStorage.getItem('authUser') || 'null');
    const [authUser, setAuthUser] = useState<UserWithRoles | null>(savedUser);
    const firebase = useContext(FirebaseContext);
    const { themeClass, theme, toggleTheme } = useTheme();

    useEffect(
        () =>
            firebase.onAuthUserListener(
                (authUser) => {
                    localStorage.setItem('authUser', JSON.stringify(authUser));
                    setAuthUser(authUser);
                },
                () => {
                    localStorage.removeItem('authUser');
                    setAuthUser(null);
                },
            ),
        [firebase],
    );

    return (
        <AuthUserContext.Provider value={authUser}>
            <BrowserRouter>
                <div className={`${s.mainContainer} ${themeClass} ${!!authUser ? '' : s.noNav}`}>
                    {!!authUser && <Navigation theme={theme} toggleTheme={toggleTheme} />}

                    <div className={s.mainContent}>
                        <Router />
                    </div>
                </div>
            </BrowserRouter>
        </AuthUserContext.Provider>
    );
};

export default App;

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import RoutePath from '../../constants/routes';

import SignIn from '../../pages/SignIn';
import HomePage from '../../pages/Home';
import SignUpPage from '../../pages/SignUp';
import Students from '../../pages/Student';
import Invoice from '../../pages/Invoice';

const Router = () => (
    <Switch>
        <Route path={RoutePath.signUp} component={SignUpPage} />
        <Route path={RoutePath.signIn} component={SignIn} />
        <Route path={RoutePath.home} component={HomePage} />
        <Route path={RoutePath.student} component={Students} />
        <Route path={RoutePath.invoice} component={Invoice} />
        <Redirect exact path="/" to="/actions" />
    </Switch>
);

export default Router;

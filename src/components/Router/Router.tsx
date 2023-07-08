import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import RoutePath from '../../constants/routes';

import SignIn from '../../pages/SignIn';
// import SignUpPage from '../../pages/SignUp';
import Students from '../../pages/Student';
import Invoice from '../../pages/Invoice';
import Invoices from '../../pages/Invoices';
import SingleInvoice from '../../pages/SingleInvoice';
import Groups from '../../pages/Groups';

const Router = () => (
  <Switch>
    {/* <Route path={RoutePath.signUp} component={SignUpPage} /> */}
    <Route path={RoutePath.signIn} component={SignIn} />
    <Route path={RoutePath.student} component={Students} />
    <Route path={RoutePath.invoice} component={Invoice} />
    <Route path={RoutePath.invoices} component={Invoices} />
    <Route path={RoutePath.singleInvoice} component={SingleInvoice} />
    <Route path={RoutePath.groups} component={Groups} />
    <Redirect exact path="/" to={RoutePath.student} />
    <Redirect exact path={RoutePath.home} to={RoutePath.student} />
  </Switch>
);

export default Router;

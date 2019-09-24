import { RouteProps, Route, Redirect } from 'react-router';
import React, { FC, useContext } from 'react';
import { AuthUserContext, Condition } from '../../utils/Session';
import RoutePath from '../../constants/routes';

interface OwnProps {
    condition: Condition;
}

type Props = RouteProps & OwnProps;

const PrivateRoute: FC<Props> = ({ condition, ...rest }) => {
    const isAllowed = useAuthorization(condition);

    return !isAllowed ? (
        <Route {...rest} component={() => <Redirect to={RoutePath.signIn} />} render={undefined} />
    ) : (
        <Route {...rest} />
    );
};

function useAuthorization(condition: Condition) {
    const authUser = useContext(AuthUserContext);

    switch (condition) {
        case Condition.isLoggedIn:
            return !!authUser;
        default:
            throw new Error('No auth condition provided');
    }
}

export default PrivateRoute;

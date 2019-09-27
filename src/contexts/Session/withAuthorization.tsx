import React, { ComponentType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Route from '../../constants/routes';
import { FirebaseContext } from '../Firebase';
import { AuthUserContext } from '.';
import { Condition } from '.';
import * as ROLES from '../../constants/roles';
import { UserWithRoles } from '../../types';

type Props = RouteComponentProps<void>;

const withAuthorization = (condition: Condition) => (Component: ComponentType) => {
    class WithAuthorization extends React.Component<Props> {
        static contextType = FirebaseContext;
        context!: React.ContextType<typeof FirebaseContext>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listener: any;

        componentDidMount() {
            this.listener = this.context.onAuthUserListener(
                (authUser) => {
                    if (!this.isAllowed(authUser)) {
                        this.props.history.push(Route.signIn);
                    }
                },
                () => {
                    this.props.history.push(Route.signIn);
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {(authUser: UserWithRoles | null) =>
                        this.isAllowed(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        }

        isAllowed(authUser: UserWithRoles | null) {
            switch (condition) {
                case Condition.isLoggedIn:
                    return !!authUser;
                case Condition.isAdmin:
                    return authUser && !!authUser.roles[ROLES.ADMIN];
                default:
                    throw new Error('No auth condition provided');
            }
        }
    }
    return withRouter(WithAuthorization);
};

export default withAuthorization;

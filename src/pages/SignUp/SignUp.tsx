import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { FirebaseContext } from '../../utils/Firebase';
import * as ROLES from '../../constants/roles';
import Route from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>SignUp </h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

type Props = RouteComponentProps<void>;

class SignUpFormBase extends Component<Props> {
    state = { ...INITIAL_STATE };
    static contextType = FirebaseContext;
    context!: React.ContextType<typeof FirebaseContext>;

    onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const { username, email, passwordOne, isAdmin } = this.state;
        const roles: { [key: string]: string } = {};
        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }

        this.context
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(
                ({ user }) =>
                    user &&
                    this.context.user(user.uid).set({
                        username,
                        email,
                        roles,
                    }),
            )
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(Route.home);
            })
            .catch((error: Error) => {
                this.setState({ error });
            });
        event.preventDefault();
    };

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const { email, passwordOne, passwordTwo, username, isAdmin } = this.state;

        const isInvalid = passwordOne !== passwordTwo || passwordOne === '' || email === '' || username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input name="username" value={username} onChange={this.onChange} type="text" placeholder="username" />
                <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email Address" />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <label>
                    Admin:
                    <input name="isAdmin" type="checkbox" checked={isAdmin} onChange={this.onChangeCheckbox} />
                </label>
                <button type="submit" disabled={isInvalid}>
                    Sign Up
                </button>
                {/* {error ? <p>{error.message}</p> : null} */}
            </form>
        );
    }
}
const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={Route.signUp}>Sign Up</Link>
    </p>
);

const SignUpForm = withRouter(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };

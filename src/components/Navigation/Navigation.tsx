import React, { FC, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu } from '@blueprintjs/core';
import { FirebaseContext } from '../../utils/Firebase';
import Route from '../../constants/routes';

type Props = RouteComponentProps<void>;

const Nav: FC<Props> = ({ history }) => {
    const firebase = useContext(FirebaseContext);
    const go = (path: string) => history.push(path);

    return (
        <Menu large>
            <Menu.Item icon="user" onClick={() => go(Route.users)} text="Users" />
            <Menu.Divider />
            <Menu.Item icon="send-to" onClick={() => firebase.doSignOut()} text="Sign Out" />
        </Menu>
    );
};

export default withRouter(Nav);

import React, { FC, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Navbar, NavbarGroup, Alignment, NavbarHeading, NavbarDivider, Button, Classes } from '@blueprintjs/core';
import { FirebaseContext } from '../../contexts/Firebase';
import Route from '../../constants/routes';
import { Theme } from '../../utils/theme';

interface OwnProps {
    theme: Theme;
    toggleTheme: () => void;
}

type Props = RouteComponentProps<void> & OwnProps;

const Nav: FC<Props> = ({ history, theme, toggleTheme }) => {
    const firebase = useContext(FirebaseContext);
    const go = (path: string) => history.push(path);
    const style = theme === Theme.dark ? { backgroundColor: '#30404d' } : undefined;

    return (
        <Navbar className={Classes.ELEVATION_3} style={style}>
            <div style={{ margin: '0 auto', width: '1200px' }}>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>Disainikoda</NavbarHeading>
                    <NavbarDivider />

                    <Button
                        className={Classes.MINIMAL}
                        icon="document"
                        onClick={() => go(Route.invoice)}
                        text="New Invoice"
                    />
                    <Button className={Classes.MINIMAL} icon="user" onClick={() => go(Route.student)} text="Students" />
                    <Button
                        className={Classes.MINIMAL}
                        icon="folder-close"
                        onClick={() => go(Route.invoices)}
                        text="Invoices"
                    />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Button
                        className={Classes.MINIMAL}
                        icon="log-out"
                        onClick={() => firebase.doSignOut()}
                        text="Sign Out"
                    />
                    <NavbarDivider />
                    <Button
                        className={Classes.MINIMAL}
                        icon={theme === Theme.dark ? 'flash' : 'moon'}
                        onClick={toggleTheme}
                    />
                </NavbarGroup>
            </div>
        </Navbar>
    );
};

export default withRouter(Nav);

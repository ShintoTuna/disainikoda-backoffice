import React, { FC, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  Navbar,
  NavbarGroup,
  Alignment,
  NavbarHeading,
  NavbarDivider,
  Button,
  Classes,
  IconName,
} from '@blueprintjs/core';
import { FirebaseContext } from '../../contexts/Firebase';
import Route from '../../constants/routes';
import { Theme } from '../../utils/theme';

interface OwnProps {
  theme: Theme;
  toggleTheme: () => void;
}

type Props = RouteComponentProps<void> & OwnProps;

interface NavLink {
  route: Route;
  name: string;
  icon: IconName;
}

const Routes: NavLink[] = [
  { route: Route.invoice, name: 'New Invoice', icon: 'document' },
  { route: Route.student, name: 'Students', icon: 'user' },
  { route: Route.groups, name: 'Groups', icon: 'people' },
  { route: Route.invoices, name: 'Invoices', icon: 'folder-close' },
];

const NavLinkComponent: FC<{ link: NavLink; go: (path: string) => void }> = ({ link, go }) => (
  <Button className={Classes.MINIMAL} icon={link.icon} onClick={() => go(link.route)} text={link.name} />
);

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

          {Routes.map((r, i) => (
            <NavLinkComponent key={i} link={r} go={go} />
          ))}
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <Button className={Classes.MINIMAL} icon="log-out" onClick={() => firebase.doSignOut()} text="Sign Out" />
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon={theme === Theme.dark ? 'flash' : 'moon'} onClick={toggleTheme} />
        </NavbarGroup>
      </div>
    </Navbar>
  );
};

export default withRouter(Nav);

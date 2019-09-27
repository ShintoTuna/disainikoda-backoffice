import React, { FC } from 'react';
import { Condition, withAuthorization } from '../../contexts/Session';

const Home: FC = () => <div>Home</div>;

export default withAuthorization(Condition.isLoggedIn)(Home);

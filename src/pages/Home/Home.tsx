import React, { FC } from 'react';
import { Condition, withAuthorization } from '../../utils/Session';

const Home: FC = () => <div>Home</div>;

export default withAuthorization(Condition.isLoggedIn)(Home);

import React, { FC } from 'react';
import { withAuthorization, Condition } from '../../utils/Session';

const Users: FC = () => {
    return <div>Users</div>;
};

export default withAuthorization(Condition.isAdmin)(Users);

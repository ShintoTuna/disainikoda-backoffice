import React, { FC, useEffect, useContext, useState } from 'react';
import { withAuthorization, Condition } from '../../utils/Session';
import { FirebaseContext } from '../../utils/Firebase';
import { UserWithRoles } from '../../types';
import { H3, Card, Divider, Button } from '@blueprintjs/core';

const Users: FC = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserWithRoles[]>();
    const fb = useContext(FirebaseContext);

    useEffect(
        () =>
            fb.users().onSnapshot((snapshot) => {
                const dbUsers: UserWithRoles[] = [];

                snapshot.forEach((doc) => dbUsers.push({ ...(doc.data() as UserWithRoles), uid: doc.id }));

                setUsers(dbUsers);
                setLoading(false);
            }),
        [fb],
    );

    return (
        <div>
            <Card>
                <H3>Users</H3>
                <Button icon="plus" small intent="primary">
                    Add User
                </Button>
            </Card>
            <Card>
                {loading && <div>Loading</div>}
                <pre>{JSON.stringify(users, null, 2)}</pre>
            </Card>
        </div>
    );
};

export default withAuthorization(Condition.isAdmin)(Users);

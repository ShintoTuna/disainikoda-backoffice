import React from 'react';
import { UserWithRoles } from '../../types/indexd';

export default React.createContext<UserWithRoles | null>(null);

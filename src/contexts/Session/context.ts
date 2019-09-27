import React from 'react';
import { UserWithRoles } from '../../types';

export default React.createContext<UserWithRoles | null>(null);

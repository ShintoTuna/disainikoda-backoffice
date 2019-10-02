import React, { FC, Fragment } from 'react';
import { Spinner } from '@blueprintjs/core';

interface Props {
    loading: boolean;
}

const Loader: FC<Props> = ({ loading, children }) => <Fragment>{loading ? <Spinner size={20} /> : children}</Fragment>;

export default Loader;

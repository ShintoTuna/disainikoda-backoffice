import React, { FC, Fragment } from 'react';

interface Props {
    loading: boolean;
}

const Loader: FC<Props> = ({ loading, children }) => <Fragment>{loading ? <div>Loading ...</div> : children}</Fragment>;

export default Loader;

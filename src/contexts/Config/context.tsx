import React, { FC, useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../Firebase';
import { Config } from '../../types';

const ConfigContext = React.createContext<Config | null>(null);

const ConfigContextProvider: FC = ({ children }) => {
    const firebase = useContext(FirebaseContext);
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        firebase.config().onSnapshot((snapshot) => {
            let agg = {};

            snapshot.forEach((doc) => {
                agg = { ...agg, ...{ [doc.id]: doc.data() } };
            });

            setConfig(agg as Config);
        });
    }, [firebase]);

    return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export { ConfigContext, ConfigContextProvider };

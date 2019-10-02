import React, { FC, useEffect, useContext, useCallback, useState, ChangeEvent } from 'react';
import { FirebaseContext } from '../../contexts/Firebase';
import { Icon, Card, Classes, InputGroup } from '@blueprintjs/core';
import { Tab, Tabs } from '@blueprintjs/core';
import Loader from '../../components/Loader';
import { withAuthorization, Condition } from '../../contexts/Session';

interface File {
    name: string;
    timeCreated: string;
    size: number;
    downloadUrl: string;
}

const Invoices: FC = () => {
    const firebase = useContext(FirebaseContext);
    const [files, setFiles] = useState<File[]>([]);
    const [year, setYear] = useState(2019);
    const [loading, setLoading] = useState(false);
    const [filterStr, setFilterStr] = useState('');
    const filteredFiles = files
        .filter((file) => file.name.toLowerCase().includes(filterStr.toLowerCase()))
        .sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
    const loadFiles = useCallback(async () => {
        setLoading(true);
        const res = await firebase.storage
            .ref()
            .child(`invoices/${year}`)
            .listAll();

        if (res.items.length === 0) {
            setLoading(false);
        }

        res.items.forEach(async (item) => {
            const downloadUrl = await item.getDownloadURL();
            const { name, timeCreated, size } = await item.getMetadata();
            setLoading(false);
            setFiles((state) => [...state, { name, timeCreated, size, downloadUrl }]);
        });
    }, [firebase.storage, year]);

    useEffect(() => {
        setFiles([]);
        loadFiles();
    }, [loadFiles, year]);

    return (
        <div>
            <Tabs
                animate
                id="navbar"
                large={true}
                onChange={(s) => setYear(parseInt(s.toString()))}
                selectedTabId={year}
            >
                <Tab id="2018" title="2018" />
                <Tab id="2019" title="2019" />
                <Tab id="2020" title="2020" />
                <Tabs.Expander />
                <InputGroup
                    className={Classes.FILL}
                    type="text"
                    placeholder="Filter..."
                    style={{ width: '200px' }}
                    onChange={({ target }: ChangeEvent<HTMLInputElement>) => setFilterStr(target.value)}
                />
            </Tabs>
            <Loader loading={loading}>
                <div style={{ marginTop: '16px' }}>
                    {files.length > 0 ? (
                        filteredFiles.map((file, i) => <FileThumb key={i} file={file} />)
                    ) : (
                        <p>No files found</p>
                    )}
                </div>
            </Loader>
        </div>
    );
};

const FileThumb: FC<{ file: File }> = ({ file }) => {
    return (
        <a href={file.downloadUrl}>
            <Card
                style={{ display: 'inline-block', margin: '8px', textAlign: 'center' }}
                className={Classes.INTERACTIVE}
            >
                <Icon icon="document" iconSize={50} />
                <div style={{ marginTop: '12px' }}>{file.name}</div>
                <div style={{ marginTop: '4px', fontSize: '0.8em', color: 'gray' }}>
                    {new Date(file.timeCreated).toDateString()}
                </div>
            </Card>
        </a>
    );
};

export default withAuthorization(Condition.isAdmin)(Invoices);

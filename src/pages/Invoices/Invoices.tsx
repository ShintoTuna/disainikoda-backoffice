import React, { FC, useEffect, useContext, useCallback, useState, ChangeEvent } from 'react';
import { FirebaseContext } from '../../contexts/Firebase';
import { Icon, Card, Classes, InputGroup, HTMLSelect } from '@blueprintjs/core';
import Loader from '../../components/Loader';
import { withAuthorization, Condition } from '../../contexts/Session';

interface File {
  name: string;
  timeCreated: string;
  size: number;
  downloadUrl: string;
}

const START_YEAR = 2018;

const Invoices: FC = () => {
  const firebase = useContext(FirebaseContext);
  const [files, setFiles] = useState<File[]>([]);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [filterStr, setFilterStr] = useState('');
  const options = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => i + START_YEAR);
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
      const file = await item.getMetadata();
      const { name, timeCreated, size } = file;
      console.log(file);
      setLoading(false);
      setFiles((state) => [...state, { name, timeCreated, size, downloadUrl }]);
    });
  }, [firebase.storage, year]);

  const handleChangeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
  };

  useEffect(() => {
    setFiles([]);
    loadFiles();
  }, [loadFiles, year]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: '8px',
          paddingLeft: '8px',
        }}
      >
        <HTMLSelect value={year} onChange={handleChangeYear} options={options} />
        <div>
          <InputGroup
            className={Classes.FILL}
            type="text"
            placeholder="Filter..."
            style={{ width: '200px' }}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => setFilterStr(target.value)}
            leftIcon={<Icon icon="search" />}
          />
        </div>
      </div>
      <Loader loading={loading}>
        <div style={{ marginTop: '16px' }}>
          {files.length > 0 ? filteredFiles.map((file, i) => <FileThumb key={i} file={file} />) : <p>No files found</p>}
        </div>
      </Loader>
    </div>
  );
};

const FileThumb: FC<{ file: File }> = ({ file }) => {
  return (
    <a href={file.downloadUrl} style={{ textDecoration: 'none' }}>
      <Card style={{ display: 'block', margin: '8px' }} className={Classes.INTERACTIVE}>
        <Icon icon="document" iconSize={24} style={{ paddingRight: '16px' }} />
        <span style={{ paddingRight: '16px' }}>{file.name}</span>
        <span style={{ fontSize: '0.8em', color: 'gray' }}>{new Date(file.timeCreated).toDateString()}</span>
      </Card>
    </a>
  );
};

export default withAuthorization(Condition.isAdmin)(Invoices);

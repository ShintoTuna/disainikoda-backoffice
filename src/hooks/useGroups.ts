import { useContext, useEffect, useState } from 'react';
import { Group } from '../types';
import { FirebaseContext } from '../contexts/Firebase';

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const firebase = useContext(FirebaseContext);

  useEffect(
    () =>
      firebase.groups().onSnapshot((snapshot) => {
        const dbGroups: Group[] = [];

        snapshot.forEach((doc) => dbGroups.push({ ...(doc.data() as Group), uid: doc.id }));

        setGroups(dbGroups);
        setLoading(false);
      }),
    [firebase],
  );

  return { loading, groups };
};

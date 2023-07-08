import { useContext, useEffect, useState } from 'react';
import { Student } from '../types';
import { FirebaseContext } from '../contexts/Firebase';

export const useStudents = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const firebase = useContext(FirebaseContext);

  useEffect(
    () =>
      firebase
        .students()
        .orderBy('firstName', 'asc')
        .onSnapshot((snapshot) => {
          const dbStudents: Student[] = [];

          snapshot.forEach((doc) => dbStudents.push({ ...(doc.data() as Student), uid: doc.id }));

          setStudents(dbStudents);
          setLoading(false);
        }),
    [firebase],
  );

  return { loading, students };
};

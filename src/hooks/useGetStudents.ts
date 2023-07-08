import { useContext } from 'react';
import { FirebaseContext } from '../contexts/Firebase';
import { Student } from '../types';

export const useGetStudents = () => {
  const firebase = useContext(FirebaseContext);
  const getStudentsByIds = async (ids: string[]) => {
    const students: Student[] = [];
    const data = await firebase.students().get();

    if (!data.empty) {
      data.forEach((doc) => {
        if (ids.includes(doc.id)) {
          students.push(doc.data() as Student);
        }
      });
    }

    console.log(students);

    return students;
  };

  return { getStudentsByIds };
};

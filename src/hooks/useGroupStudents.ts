import { useContext } from 'react';
import { FirebaseContext } from '../contexts/Firebase';
import { GroupStudent, Student } from '../types';

export const useGroupStudents = () => {
  const firebase = useContext(FirebaseContext);

  const getStudentCollection = (groupUid: string) =>
    firebase
      .groups()
      .doc(groupUid)
      .collection('students');

  const loadStudents = async (groupUid: string) => {
    const dbStudents: GroupStudent[] = [];
    const studentsCollection = getStudentCollection(groupUid);

    const docSnap = await studentsCollection.get();

    if (!docSnap.empty) {
      docSnap.forEach((doc) => {
        const student = doc.data() as GroupStudent;

        dbStudents.push({ ...student, groupUid: doc.id });
      });
    } else {
      console.log('No such document!');
    }

    return dbStudents;
  };

  const removeStudent = async (groupUid: string, student: GroupStudent) => {
    const studentsCollection = getStudentCollection(groupUid);

    try {
      await studentsCollection.doc(student.groupUid).delete();
    } catch (error) {
      console.log(error);
    }
  };

  const addStudent = async (groupUid: string, { uid, firstName, lastName }: Student) => {
    const studentsCollection = getStudentCollection(groupUid);

    try {
      const dbStudents = await studentsCollection.where('uid', '==', uid).get();

      if (dbStudents.empty) {
        await studentsCollection.add({ uid, firstName, lastName });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { removeStudent, loadStudents, addStudent };
};

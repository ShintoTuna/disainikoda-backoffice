import React, { FC, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react';
import { Student } from '../../types';
import { FirebaseContext } from '../../contexts/Firebase';
import { Classes, Button, Card } from '@blueprintjs/core';
import Loader from '../../components/Loader';
import StudentsForm from './StudentForm';
import { withAuthorization, Condition } from '../../contexts/Session';
import { getCompany, getName } from '../../utils/student';

const Students: FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const firebase = useContext(FirebaseContext);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const deleteStudent = async (student: Student) => {
    const approval = window.confirm(`Remove ${student.lastName} ${student.firstName}`);
    if (approval) {
      await firebase.student(student.uid).delete();
    }
  };

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

  return (
    <Card>
      <Button
        onClick={() => {
          setOpen(true);
          setSelectedStudent(null);
        }}
        style={{ marginBottom: '16px' }}
      >
        Add new
      </Button>
      <StudentsForm isOpen={isOpen} close={() => setOpen(false)} selected={selectedStudent} />
      <Loader loading={loading}>
        {students.length > 0 && (
          <table className={[Classes.HTML_TABLE, Classes.INTERACTIVE].join(' ')} style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Billing</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <StudentRow
                  setOpen={setOpen}
                  key={i}
                  student={student}
                  setSelected={() => setSelectedStudent(student)}
                  deleteStudent={() => deleteStudent(student)}
                  index={i + 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </Loader>
    </Card>
  );
};

const StudentRow: FC<{
  student: Student;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: () => void;
  deleteStudent: () => void;
  index: number;
}> = ({ student, setOpen, setSelected, index, deleteStudent }) => {
  const billingInformation = () => {
    if (student.billing) {
      return (
        <div>
          {student.billing.companyName}
          <br />
          {student.billing.companyAddress}
          <br />
          {student.billing.companyRegNumber}
        </div>
      );
    }

    return '';
  };

  return (
    <tr>
      <td>{index}</td>
      <td>{getName(student)}</td>
      <td>{student.email}</td>
      <td>{student.phone}</td>
      <td>{billingInformation()}</td>
      <td>
        <Button
          icon="edit"
          style={{ marginRight: '8px' }}
          onClick={() => {
            setOpen(true);
            setSelected();
          }}
        />

        <Button icon="trash" onClick={() => deleteStudent()} />
      </td>
    </tr>
  );
};

export default withAuthorization(Condition.isAdmin)(Students);

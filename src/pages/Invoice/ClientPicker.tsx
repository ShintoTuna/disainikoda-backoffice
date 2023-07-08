import { FC } from 'react';
import { Student } from '../../types';
import React from 'react';
import { useStudents } from '../../hooks/useStudents';

interface ClientPickerProps {
  addStudents: (students: Student[]) => void;
}

const ClientPicker: FC<ClientPickerProps> = ({ addStudents }) => {
  const { students } = useStudents();

  return (
    <ul>
      {students.map((student) => (
        <li key={student.uid} onClick={() => addStudents([student])}>
          {student.firstName} {student.lastName}
        </li>
      ))}
    </ul>
  );
};

export default ClientPicker;

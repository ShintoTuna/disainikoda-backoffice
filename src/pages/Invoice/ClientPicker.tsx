import { FC } from 'react';
import { Student } from 'types';
import React from 'react';
import { useStudents } from 'hooks/useStudents';
import { Button, H5 } from '@blueprintjs/core';

interface ClientPickerProps {
  addStudents: (students: Student) => void;
}

const ClientPicker: FC<ClientPickerProps> = ({ addStudents }) => {
  const { students } = useStudents();

  return (
    <div>
      <H5>Clients</H5>
      {students.map((student) => (
        <Button minimal style={{ display: 'block' }} key={student.uid} onClick={() => addStudents(student)}>
          {student.firstName} {student.lastName}
        </Button>
      ))}
    </div>
  );
};

export default ClientPicker;

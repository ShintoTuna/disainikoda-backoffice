import { Button, Dialog } from '@blueprintjs/core';
import React, { FC, useEffect, useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Student } from '../../types';
import { useGroupStudents } from '../../hooks/useGroupStudents';
import { getName } from 'utils/student';

interface Props {
  isOpen: boolean;
  close: () => void;
  groupUid: string;
  studentUids: string[];
}

export const AddStudent: FC<Props> = ({ isOpen, close, groupUid, studentUids }) => {
  const { students } = useStudents();

  const [addedStudentIds, setAddedStudentIds] = useState<string[]>([]);
  const { addStudent } = useGroupStudents();

  const handleAddStudent = async (student: Student) => {
    setAddedStudentIds((ids) => [...ids, student.uid]);
    await addStudent(groupUid, student);
  };

  useEffect(() => {
    setAddedStudentIds(studentUids);
  }, [studentUids]);

  return (
    <Dialog isOpen={isOpen}>
      <h1>Add Student</h1>
      <Button onClick={close}>Close</Button>
      {students.map((student) => (
        <div key={student.uid}>
          {getName(student)}
          <Button disabled={addedStudentIds.includes(student.uid)} onClick={() => handleAddStudent(student)}>
            Add
          </Button>
        </div>
      ))}
    </Dialog>
  );
};

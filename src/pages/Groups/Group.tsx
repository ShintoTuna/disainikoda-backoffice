import React, { FC, useEffect, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { AddStudent } from '../../pages/Groups/AddStudent';
import { Group as GroupType, GroupStudent } from '../../types';
import { useGroupStudents } from '../../hooks/useGroupStudents';
import { getName } from 'utils/student';

interface Props {
  group: GroupType;
}

export const Group: FC<Props> = ({ group }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<GroupStudent[]>([]);
  const { loadStudents, removeStudent } = useGroupStudents();

  const load = async () => {
    const newStudents = await loadStudents(group.uid);
    setStudents(newStudents);
  };

  useEffect(() => {
    load();
  }, [group]);

  const handleRemoveStudent = async (student: GroupStudent) => {
    await removeStudent(group.uid, student);
    const newStudents: GroupStudent[] = await loadStudents(group.uid);

    setStudents(newStudents);
  };

  const close = () => {
    setIsOpen(false);
    load();
  };

  return (
    <div>
      <h2>{group.name}</h2>
      <div>
        <Button onClick={() => setIsOpen(true)}>Add student</Button>
        <ul>
          {students.map((student) => (
            <li key={student.uid}>
              {getName(student)}
              <Button onClick={() => handleRemoveStudent(student)}>Remove</Button>
            </li>
          ))}
        </ul>
        <AddStudent
          groupUid={group.uid}
          isOpen={isOpen}
          close={close}
          studentUids={students.map((student) => student.uid)}
        />
      </div>
    </div>
  );
};

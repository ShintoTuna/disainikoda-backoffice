import { FC } from 'react';
import { Student } from 'types';
import React from 'react';
import { useGroups } from 'hooks/useGroups';
import { useGroupStudents } from 'hooks/useGroupStudents';
import { Button, H5 } from '@blueprintjs/core';
import { useGetStudents } from 'hooks/useGetStudents';

interface ClientPickerProps {
  addStudents: (students: Student[]) => void;
}

const ClientPicker: FC<ClientPickerProps> = ({ addStudents }) => {
  const { groups } = useGroups();
  const { loadStudents } = useGroupStudents();
  const { getStudentsByIds } = useGetStudents();

  const handleGroupSelect = async (groupUid: string) => {
    const groupStudents = await loadStudents(groupUid);
    const students = await getStudentsByIds(groupStudents.map((student) => student.uid));

    addStudents(students);
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <H5>Groups</H5>
      {groups.map((group) => (
        <Button minimal style={{ display: 'block' }} key={group.uid} onClick={() => handleGroupSelect(group.uid)}>
          {group.name}
        </Button>
      ))}
    </div>
  );
};

export default ClientPicker;

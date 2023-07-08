import { FC } from 'react';
import { Student } from '../../types';
import React from 'react';
import { useGroups } from '../../hooks/useGroups';
import { useGroupStudents } from '../../hooks/useGroupStudents';
import { useGetStudents } from '../../hooks/useGetStudents';

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
    <ul>
      {groups.map((group) => (
        <li key={group.uid} onClick={() => handleGroupSelect(group.uid)}>
          {group.name}
        </li>
      ))}
    </ul>
  );
};

export default ClientPicker;

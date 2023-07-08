import { Button, Card } from '@blueprintjs/core';
import React, { useState } from 'react';
import { Group } from '../../types';
import { Group as GroupComp } from '../../pages/Groups/Group';
import { AddGroup } from '../../pages/Groups/AddGroup';
import { useGroups } from '../../hooks/useGroups';

const Groups = () => {
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  return (
    <Card>
      <h1>Groups</h1>
      <Button onClick={() => setIsAddGroupOpen(true)}>Add Group</Button>
      <ul>
        {groups.map((group) => (
          <li key={group.uid} onClick={() => setSelectedGroup(group)}>
            {group.name}
          </li>
        ))}
      </ul>
      <div>{selectedGroup && <GroupComp group={selectedGroup} />}</div>
      <AddGroup isOpen={isAddGroupOpen} close={() => setIsAddGroupOpen(false)} />
    </Card>
  );
};

export default Groups;

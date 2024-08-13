import React from 'react';

import { ListItem } from '@mui/material';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@mui/icons-material/NavigateNextOutlined';
import ExpandMore from '@mui/icons-material/ExpandMore';
import List from '@material-ui/core/List';

import { ProjectItemData } from './interfaces';
import { ProjectItem } from './ProjectItem.tsx';

interface ExpandablePanelProps {
  title: string;
  fetchData: () => Promise<void>;
  selectedIndex: number;
  showButton: boolean;
  setSelectedIndex: (index: number) => void;
  info: (message: string, type: 'error' | 'success') => void;
  items?: ProjectItemData[];
}

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  title,
  fetchData,
  selectedIndex,
  showButton,
  setSelectedIndex,
  info,
  items = []
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const _handleClick = () => setIsOpen(!isOpen);

  return (
    <List>
      <ListItem onClick={_handleClick} style={{ cursor: 'pointer' }}>
        {isOpen ? <ExpandMore htmlColor='gray' /> : <ExpandLess htmlColor='gray' />}
        <h2 className='text-sm text-gray-500'>{title}</h2>
      </ListItem>

      <Collapse in={isOpen} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {items.map((item) => (
            <ProjectItem
              name={item.name}
              key={item.id}
              showButton={showButton}
              index={item.id}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              fetchData={fetchData}
              info={info}
            />
          ))}
        </List>
      </Collapse>
    </List>
  );
};
export default ExpandablePanel;

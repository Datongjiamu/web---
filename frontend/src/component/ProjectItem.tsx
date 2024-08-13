import React, {useState} from 'react';
import axios from 'axios';

import IconButton from '@material-ui/core/IconButton';
import RemoveTaskIcon from '@mui/icons-material/Delete';
import {ListItemButton, ListItemText} from '@mui/material';
import {Share} from '@mui/icons-material';

import {apiUrl, TimeWait} from './Common';
import ShareProjectModel from './ShareProjectModel.tsx';

interface ProjectListProps {
  name: string;
  index: number;
  selectedIndex: number;
  showButton: boolean;
  setSelectedIndex: (index: number) => void;
  fetchData: () => Promise<void>;
  info: (message: string, type: 'error' | 'success') => void;
}

export const ProjectItem: React.FC<ProjectListProps> = ({
  name,
  index,
  showButton,
  selectedIndex,
  setSelectedIndex,
  fetchData,
  info
}) => {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState('');

  const _handleClose = () => {
    setOpen(false);
  };

  const _handleProjectDeletion = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(`${apiUrl}/project`, { params: { project_id: index } });
      if (response.data.success) {
        info('操作完成', 'success');
        await TimeWait(750);
        setSelectedIndex(-1);
        await fetchData();
      } else {
        info('操作失败，请稍后再试。', 'error');
      }
    } catch (err) {
      info('操作失败，请稍后再试。', 'error');
    }
  }

  const _handleProjectShare = async () => {
    if (email === '') {
      info('电子邮件不能为空!', 'error');
      return;
    }
    const response = await axios.post(`${apiUrl}/project/collaborate`, { email: email, project_id: index });
    if (response.data.success) {
      info('添加成功', 'success');
      await fetchData();
      await TimeWait(750);
      _handleClose();
    } else {
      info(response.data.message, 'error');
    }
  }

  return (
    <ListItemButton
      className='pl-4 group'
      disableRipple
      selected={index === selectedIndex}
      onClick={() => {
        setSelectedIndex(index);
      }}
    >
      <ListItemText className='ml-5' primary={name} sx={{ wordWrap: 'break-word' }} />
      {showButton && (
        <>
          <div className='space-x-2 hidden group-hover:block'>
            <IconButton
              edge='end'
              size='small'
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
              }}
            >
              <Share className='text-lime-500' />
            </IconButton>
            <IconButton edge='end' size='small' onClick={_handleProjectDeletion}>
              <RemoveTaskIcon className='text-red-400' />
            </IconButton>
          </div>
          <div
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <ShareProjectModel
              open={open}
              handleClose={_handleClose}
              handleProjectShare={_handleProjectShare}
              setEmail={setEmail}
            />
          </div>
        </>
      )}
    </ListItemButton>
  );
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import ExpandablePanel from './ExpandablePanel';
import addButton from '../assets/add_circle.svg';
import CreateProjectModal from './CreateProjectModal';
import { apiUrl } from './Common';
import { ProjectItemData } from './interfaces';

interface SiderProps {
  width: number;
  setWidth: (width: number) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  projectList: ProjectItemData[];
  setProjectList: (projects: ProjectItemData[]) => void;
  info: (message: string, type: 'error' | 'success') => void;
}

const Sidebar: React.FC<SiderProps> = ({
  width,
  setWidth,
  selectedIndex,
  setSelectedIndex,
  projectList,
  setProjectList,
  info
}) => {
  const _handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = width;

    const _handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth + e.clientX - startX;
      if (newWidth > 500) newWidth = 500;
      if (newWidth < 200) newWidth = 200;
      setWidth(newWidth);
    };
    const _handleMouseUp = () => {
      document.removeEventListener('mousemove', _handleMouseMove);
      document.removeEventListener('mouseup', _handleMouseUp);
    };

    document.addEventListener('mousemove', _handleMouseMove);
    document.addEventListener('mouseup', _handleMouseUp);
  };

  const [isOpen, setOpen] = useState(false);

  const _handleClose = () => {
    setOpen(false);
  }

  const _fetchData = async () => {
    try {
      const allProjects = await axios.get(`${apiUrl}/project`);
      if (!allProjects.data.success) {
        info('更新数据异常!', 'error');
      } else {
        setProjectList(allProjects.data.value);
      }
    } catch (err) {
      console.log(err);
      info('更新数据异常!', 'error');
    }
  }

  useEffect(() => {
    _fetchData();
  }, []);

  return (
    <Paper elevation={3}>
      <div className='flex-row flex h-full fixed'>
        <div className='flex h-full pt-20 left-0 bg-white overflow-y-auto'>
          <div style={{ width: width }}>
            <div className='flex items-center justify-between px-3 mb-1'>
              <h2 className='text-lg font-bold'>项目</h2>
              <IconButton
                className='p-1 rounded bg-transparent'
                onClick={() => {
                  setOpen(true);
                }}
              >
                <img src={addButton} alt='Add' className='w-6 h-6' />
              </IconButton>
            </div>

            <ExpandablePanel
              title={'我创建的'}
              items={projectList.filter((project) => {
                return project.type === 0;
              })}
              fetchData={_fetchData}
              info={info}
              showButton={true}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />

            <ExpandablePanel
              title={'我参与的'}
              items={projectList.filter((project) => {
                return project.type === 1;
              })}
              fetchData={_fetchData}
              info={info}
              showButton={false}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </div>
        </div>
        <div
          onMouseDown={_handleMouseDown}
          className='justify-end top-0 w-1 h-full cursor-ew-resize bg-gray-200 hover:bg-sky-500'
        />
      </div>
      <CreateProjectModal open={isOpen} handleClose={_handleClose} fetchData={_fetchData} info={info} />
    </Paper>
  );
};

export default Sidebar;

import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';

import Sidebar from '../component/Sidebar';
import Swimlane from '../component/Swimlane';
import TopBar from '../component/TopBar';
import Card from '../component/TodoCard';
import TaskTopBar from '../component/TaskTopBar';
import {CustomSnackbar, useCustomSnackbar} from '../component/CustomSnackBar';
import {apiUrl, TimeWait} from '../component/Common';
import {TaskItemData, ProjectItemData} from '../component/interfaces';
import CreateTaskModal from '../component/CreateTaskModal';

const WorkSpace: React.FC = () => {
  const { message, openMessage, info, closeInfo } = useCustomSnackbar();

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [projectList, setProjectList] = useState<ProjectItemData[]>([]);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState<{ type1: TaskItemData[]; type2: TaskItemData[]; type3: TaskItemData[] }>({
    type1: [],
    type2: [],
    type3: []
  });

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username;

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  function getProjectName() {
    const tasks = projectList.filter((task) => {
      return task.id === selectedIndex;
    });
    if (tasks.length > 0) {
      setTitle(tasks[0].name);
    } else setTitle('');
  }

  const fetchTaskData = async () => {
    if (selectedIndex === -1) {
      setTasks({ type1: [], type2: [], type3: [] });
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/task`, { params: { project_id: selectedIndex } });
      if (response.data.success) {
        const taskDataList = response.data.value as TaskItemData[];
        const type1Projects = taskDataList.filter((task) => task.type === 1);
        const type2Projects = taskDataList.filter((task) => task.type === 2);
        const type3Projects = taskDataList.filter((task) => task.type === 3);
        setTasks({ type1: type1Projects, type2: type2Projects, type3: type3Projects });
      } else {
        info('更新数据异常!', 'error');
      }
    } catch (err) {
      console.log(err);
      info('更新数据异常!', 'error');
    }
  };

  const handleDeleteTask = async (task_id: number) => {
    try {
      const response = await axios.delete(`${apiUrl}/task`, { params: { task_id: task_id } });
      if (response.data.success) {
        info('操作成功', 'success');
        await TimeWait(750);
        await fetchTaskData();
      } else {
        info('删除失败，请稍后重试', 'error');
      }
    } catch (err) {
      console.error(err);
      info('删除失败，请稍后重试', 'error');
    }
  };

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  useEffect(() => {
    fetchTaskData();
    getProjectName();
  }, [selectedIndex]);

  return (
    <div className='flex-1 flex-col w-full h-full'>
      <TopBar username={username} toggleSidebar={toggleSidebar} />

      <div className='flex w-full h-full'>
        {isSidebarVisible && (
          <Sidebar
            width={sidebarWidth}
            setWidth={setSidebarWidth}
            info={info}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            projectList={projectList}
            setProjectList={setProjectList}
          />
        )}
        <div
          className='flex flex-col pt-16 w-full h-full bg-[#fff]'
          style={{ paddingLeft: isSidebarVisible ? sidebarWidth + 2 : 0 }}
        >
          {title && (<TaskTopBar title={title} hasCreate={true} disabled={selectedIndex === -1} setModelOpen={setIsModelOpen} />)}

          {selectedIndex !== -1 && (
            <div className='flex h-full overflow-x-auto overflow-y-auto flex-row' style={{ gap: '25px', padding: '20px' }}>
              <Swimlane title='待办'>
                {tasks.type1.map((task) => (
                  <Card
                    key={task.id}
                    project_id={task.project_id}
                    title={task.subject}
                    create_date={task.create_date}
                    start_date={task.start_date}
                    end_date={task.end_date}
                    description={task.description}
                    creator={task.creator}
                    task_id={task.id}
                    handleDelete={() => {
                      handleDeleteTask(task.id);
                    }}
                    info={info}
                    fetchTaskData={fetchTaskData}
                  />
                ))}
              </Swimlane>

              <Swimlane title='正在进行'>
                {tasks.type2.map((task) => (
                  <Card
                    key={task.id}
                    project_id={task.project_id}
                    title={task.subject}
                    create_date={task.create_date}
                    start_date={task.start_date}
                    end_date={task.end_date}
                    description={task.description}
                    creator={task.creator}
                    task_id={task.id}
                    handleDelete={() => {
                      handleDeleteTask(task.id);
                    }}
                    info={info}
                    fetchTaskData={fetchTaskData}
                  ></Card>
                ))}
              </Swimlane>

              <Swimlane title='已完成'>
                {tasks.type3.map((task) => (
                  <Card
                    key={task.id}
                    project_id={task.project_id}
                    title={task.subject}
                    create_date={task.create_date}
                    start_date={task.start_date}
                    end_date={task.end_date}
                    description={task.description}
                    creator={task.creator}
                    task_id={task.id}
                    handleDelete={() => {
                      handleDeleteTask(task.id);
                    }}
                    info={info}
                    fetchTaskData={fetchTaskData}
                  ></Card>
                ))}
              </Swimlane>
            </div>
          )}
        </div>

        {isModelOpen && (
          <CreateTaskModal
            isOpen={isModelOpen}
            project_id={selectedIndex}
            handleClose={() => setIsModelOpen(false)}
            info={info}
            fetchTaskData={fetchTaskData}
          />
        )}
      </div>

      <CustomSnackbar messageInfo={message} onClose={() => closeInfo()} isOpen={openMessage} />
    </div>
  );
};

export default WorkSpace;

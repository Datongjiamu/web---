import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Fade } from '@material-ui/core';
import Container from '@mui/material/Container';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Textarea } from '@mui/joy';
import Button from '@material-ui/core/Button';

import { apiUrl, DateSelector, getDate, TimeWait } from './Common';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    createButton: {
      backgroundColor: '#4285f4',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1a73e8'
      }
    }
  })
);

interface TaskModalProps {
  isOpen: boolean;
  project_id:number;
  task_id?: number;
  info: (message: string, type: 'error' | 'success') => void;
  handleClose: () => void;
  fetchTaskData: () => Promise<void>;
  alter?: boolean;
  default_subject?: string;
  default_startDate?: string;
  default_endDate?: string;
  default_description?: string;
}

const CreateTaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  project_id,
  task_id,
  info,
  handleClose,
  fetchTaskData,
  alter = false,
  default_subject = '',
  default_startDate = '',
  default_endDate = '',
  default_description = ''
}) => {
  const classes = useStyles();
  const location = useLocation();

  const currDate = getDate();
  if (default_startDate === '') default_startDate = currDate;
  if (default_endDate === '') default_endDate = currDate;
  const [subject, setSubject] = useState(default_subject);
  const [startDate, setStartDate] = useState(default_startDate);
  const [endDate, setEndDate] = useState(default_endDate);
  const [description, setDescription] = useState(default_description);

  const username = location.state?.username;

  async function handleSubmit() {
    if (subject === '' || startDate === '' || endDate === '') {
      info('还有必填项没有填写!', 'error');
      return;
    }
    const o_startDate = new Date(startDate);
    const o_endDate = new Date(endDate);
    const o_currDate = new Date(currDate);

    if (o_startDate > o_endDate) {
      info('截止日期不能早于开始日期!', 'error');
      return;
    }
    let type;
    if (o_endDate < o_currDate) type = 3; //已完成
    else if (o_startDate > o_currDate) type = 1; //待办
    else type = 2;

    if (!alter) {
      try {
        const response = await axios.post(`${apiUrl}/task`, {
          subject: subject,
          creator: username,
          create_date: currDate,
          start_date: startDate,
          end_date: endDate,
          description: description,
          type: type,
          project_id: project_id
        });
        if (response.data.success) {
          info('添加成功', 'success');
          await fetchTaskData();
          await TimeWait(750);
          handleClose();
        } else {
          info('添加失败，请稍后重试', 'error');
        }
      } catch (err) {
        console.log(err);
        info('添加失败，请稍后重试', 'error');
      }
    } else {
      try {
        const response = await axios.put(`${apiUrl}/task`, {
          id: task_id,
          subject: subject,
          creator: username,
          create_date: currDate,
          start_date: startDate,
          end_date: endDate,
          description: description,
          type: type
        });
        if (response.data.success) {
          info('修改成功', 'success');
          await fetchTaskData();
          await TimeWait(750);
          handleClose();
        } else {
          info('修改失败，请稍后重试', 'error');
        }
      } catch (err) {
        console.log(err);
        info('修改失败，请稍后重试', 'error');
      }
    }
  }

  return (
    <Modal
      className={classes.modal}
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={isOpen}>
        <div className='w-[60vh]'>
          <Container fixed className='flex flex-col px-4 pb-10 pt-8 bg-white'>
            <div className='flex items-center ml-5 mb-2 justify-between'>
              <h1 className='font-semibold text-2xl'>{!alter ? '创建任务' : '修改任务'}</h1>
              <IconButton className='rounded' onClick={handleClose}>
                {' '}
                <CloseOutlinedIcon />{' '}
              </IconButton>
            </div>
            <div className='flex flex-col mt-5 ml-5 pb-10'>
              <Textarea
                placeholder='任务名称'
                maxRows={2}
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                }}
              />
            </div>

            <div className='flex items-center mt-5 ml-5 pb-10 justify-between'>
              <DateSelector
                label='开始日期'
                defaultValue={startDate}
                onChange={(date) => setStartDate(date.target.value)}
              />
              <DateSelector
                label='截止日期'
                defaultValue={endDate}
                onChange={(date) => setEndDate(date.target.value)}
              />
            </div>

            <h2 className='mt-5 ml-5 mb-2 mr-4'> 描述 (可选) </h2>
            <Textarea
              className='ml-5 mt-5'
              placeholder='添加描述'
              maxRows={4}
              minRows={3}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />

            <div className='flex w-full mt-12 ml-auto flex-row-reverse'>
              <Button variant='contained' className={classes.createButton} onClick={handleSubmit}>
                {!alter ? '创建' : '修改'}
              </Button>
            </div>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};

export default CreateTaskModal;

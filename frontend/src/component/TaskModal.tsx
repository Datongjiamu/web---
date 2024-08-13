import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@material-ui/core/IconButton';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Textarea } from '@mui/joy';
import Container from '@mui/material/Container';
import List from '@mui/material/List';

import CommentZone from './CommentZone';
import { apiUrl, AvatarWithName, DateYMD, TimeWait } from './Common';
import { CommentItemData, UploadFileData } from './interfaces';
import { UploadItem } from './UploadItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    }
  })
);

interface TaskModalProps {
  project_id: number;
  title: string;
  creator: string;
  create_date: string;
  // modify_time: number;
  start_date: string;
  end_date: string;
  description: string;
  isOpen: boolean;
  handleClose: () => void;
  task_id: number;
  info: (message: string, type: 'success' | 'error') => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  project_id,
  title,
  creator,
  create_date,
  start_date,
  end_date,
  description,
  isOpen,
  handleClose,
  task_id,
  info
}) => {
  const classes = useStyles();
  const [FoldDetail, setFoldDetail] = React.useState(false);
  const [uploadFileList, setUploadFileList] = React.useState<UploadFileData[]>([]);
  const [commentList, setCommentList] = useState<CommentItemData[]>([]);
  const o_currDate = new Date();
  const o_createDate = new Date(create_date);
  const o_startDate = new Date(start_date);
  const o_endDate = new Date(end_date);

  const timeDifference = o_currDate.getTime() - o_createDate.getTime();
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const _toggleFoldDetail = () => {
    setFoldDetail(!FoldDetail);
  };

  const _handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await _handleFileUpload(event.target.files[0]);
    }
  };

  const _handleFileUpload = async (file: File) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task_id', task_id.toString());
    try {
      const response = await axios.post(`${apiUrl}/task/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        info('文件上传成功', 'success');
        await TimeWait(750);
        await _fetchUploadFile();
      } else {
        info(response.data.value, 'error');
      }
    } catch (error) {
      console.error(error);
      info('文件上传失败', 'error');
    }
  };

  const _fetchComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/comment`, { params: { task_id: task_id } });
      if (response.data.success) {
        setCommentList(response.data.value);
      } else {
        info('获取评论失败!', 'error');
      }
    } catch (err) {
      console.error(err);
      info('获取评论失败!', 'error');
    }
  };

  const _fetchUploadFile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/upload`, { params: { task_id: task_id } });
      if (response.data.success) {
        setUploadFileList(response.data.value);
      } else {
        info('获取附件失败!', 'error');
      }
    } catch (err) {
      console.error(err);
      info('获取附件失败!', 'error');
    }
  };

  useEffect(() => {
    console.log('project_id',project_id);
    if (!isOpen) return;
    _fetchUploadFile();
    _fetchComments();
  }, [isOpen]);

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
        <div className='w-[100vh]'>
          <Container fixed className='flex flex-col px-4 pb-10 pt-8 bg-white'>
            <div className='flex items-center ml-5 mb-2 justify-between'>
              <h1 className='font-semibold text-2xl'> {title} </h1>
              <IconButton className='rounded' onClick={handleClose}>
                {' '}
                <CloseOutlinedIcon />{' '}
              </IconButton>
            </div>

            <div className='flex'>
              <Container
                sx={{
                  maxHeight: '75vh',
                  overflow: 'auto',
                  flex: 6
                }}
                className='flex flex-row mr-3 mb-1'
              >
                {/* <h2 className='pt-5 font-semibold pb-2'>描述</h2> */}
                {description && (<Textarea placeholder='描述' variant='plain' minRows={1} maxRows={4} value={description} disabled className="border" />)}

                <div className='mb-3 mt-5 justify-between'>
                  <input accept='*' className='hidden' id='button-file' type='file' onChange={_handleFileChange} />
                  <label htmlFor='button-file'>
                    <Button startIcon={<AttachFileOutlinedIcon />} variant='contained' component='span'>
                      添加附件
                    </Button>
                  </label>
                </div>

                {uploadFileList.length > 0 && (
                  <div className='overflow-y-auto'>
                    <h2 className='pt-5 font-semibold pb-2'>附件</h2>
                    <List sx={{ width: '100%' }}>
                      {uploadFileList.map((file: UploadFileData) => (
                        <UploadItem
                          file_name={file.file_name}
                          file_id={file.id}
                          task_id={task_id}
                          fetchUploadList={_fetchUploadFile}
                          info={info}
                          key={file.id}
                        />
                      ))}
                    </List>
                  </div>
                )}

                <h2 className='pt-5 font-semibold'>评论</h2>
                <CommentZone commentList={commentList} fetchComments={_fetchComments} info={info} task_id={task_id} />
              </Container>

              <Container
                sx={{
                  maxHeight: '75vh',
                  overflow: 'auto',
                  flex: 4
                }}
                className='flex flex-col ml-3 mb-1 overflow-y-auto'
              >
                <div className='border rounded-lg'>
                  <Button className='w-full' onClick={_toggleFoldDetail}>
                    <h2 className='font-semibold'>详细信息</h2>
                    {!FoldDetail && <KeyboardArrowDownOutlinedIcon />}
                    {FoldDetail && <KeyboardArrowRightOutlinedIcon />}
                  </Button>
                  {!FoldDetail && (
                    <>
                      <hr className='w-full' />
                      <div className='p-3'>
                        <div className='flex py-3 items-center justify-between'>
                          <h3 className='text-sm '>发起人</h3>
                          <AvatarWithName src='broken' name={creator} />
                        </div>
                        <div className='flex py-3 items-center justify-between'>
                          <h3 className='text-sm py-3'>开始日期</h3>
                          <DateYMD
                            year={o_startDate.getFullYear()}
                            month={o_startDate.getMonth() + 1}
                            day={o_startDate.getDate()}
                          />
                        </div>
                        <div className='flex py-3 items-center justify-between'>
                          <h3 className='text-sm py-3'>截止日期</h3>
                          <DateYMD
                            year={o_endDate.getFullYear()}
                            month={o_endDate.getMonth() + 1}
                            day={o_endDate.getDate()}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className='pt-8 text-sm pl-3 text-gray-500'>
                  {(daysDifference > 0) && (<p>创建于 {daysDifference}天前</p>)}
                  {(daysDifference == 0) && (<p>创建于 今天</p>)}
                  {/*<p>更新日期 {modify_time}天前</p>*/}
                </div>
              </Container>
            </div>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};

export default TaskModal;

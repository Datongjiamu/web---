import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import { Paper } from '@material-ui/core';
import { Textarea } from '@mui/joy';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { CommentItemData } from './interfaces';
import { apiUrl, TimeWait } from './Common';
import CommentBox from './CommentBox';
import Person from '../assets/person.svg';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-2px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      backgroundColor: '#4285f4',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1a73e8'
      }
    }
  })
);

interface CommentZoneProps {
  task_id: number;
  commentList: CommentItemData[];
  fetchComments: () => Promise<void>;
  info: (message: string, type: 'success' | 'error') => void;
}

const CommentZone: React.FC<CommentZoneProps> = ({ task_id, commentList, fetchComments, info }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState('');

  const timeoutRef = useRef<number | null>(null);
  const classes = useStyles();
  const location = useLocation();
  const username = location.state?.username;

  const _handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsFocused(true);
  };

  const handleBlur = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const _submitComment = async () => {
    try {
      const response = await axios.post(`${apiUrl}/task/comment`, { message: message, task_id: task_id });
      if (response.data.success) {
        info('发送成功', 'success');
        setMessage('');
        await TimeWait(750);
        await fetchComments();
      } else {
        info('发送失败，请重试', 'error');
      }
    } catch (err) {
      console.error(err);
      info('发送失败，请重试', 'error');
    }
  };

  const _deleteComment = async (comment_id: number) => {
    try {
      const response = await axios.delete(`${apiUrl}/task/comment`, { params: { comment_id: comment_id } });
      if (response.data.success) {
        info('操作成功', 'success');
        await TimeWait(750);
        await fetchComments();
      } else {
        info('删除失败，请重试', 'error');
      }
    } catch (err) {
      console.error(err);
      info('删除失败，请重试', 'error');
    }
  };

  return (
    <Paper elevation={0} className='pt-6 pb-3 '>
      <Grid container wrap='nowrap' spacing={2}>
        <Grid item>
          <img src={Person} alt='Person' style={{ width: '40px' }} />
        </Grid>
        <Grid item className='w-full'>
          <Textarea
            placeholder='发表评论'
            variant='plain'
            value={message}
            maxRows={4}
            onFocus={_handleFocus}
            onBlur={handleBlur}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          ></Textarea>
          {(
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 1,
                animation: `${fadeIn} 0.3s ease-out`
              }}
            >
              <Button size='small' variant='contained' disabled={!message} className={classes.button} onClick={_submitComment}>
                发布
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {commentList.map((comment) => (
        <CommentBox
          imgLink='broken'
          username={comment.username}
          content={comment.message}
          timestamp={comment.timestamp}
          comment_id={comment.id}
          displayDelete={comment.username === username}
          deleteComment={_deleteComment}
        />
      ))}
    </Paper>
  );
};

export default CommentZone;

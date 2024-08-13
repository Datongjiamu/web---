import React from 'react';

import Grid from '@mui/material/Grid';
import { Paper } from '@material-ui/core';
import Person from '../assets/person.svg';

function timeSince(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const fiveDays = 5 * day;

  if (diffInSeconds < minute) {
    return `${diffInSeconds} 秒前`;
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} 分钟前`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} 小时前`;
  } else if (diffInSeconds < fiveDays) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} 天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }
}

interface CommentBoxItemProps {
  username: string;
  imgLink: string;
  content: string;
  timestamp: number;
  comment_id: number;
  displayDelete: boolean;
  deleteComment: (comment_id: number) => Promise<void>;
}

const CommentBox: React.FC<CommentBoxItemProps> = ({
  username,
  content,
  timestamp,
  comment_id,
  displayDelete,
  deleteComment
}) => {
  return (
    <Paper elevation={0} className='pt-5 group'>
      <Grid container wrap='nowrap' spacing={2}>
        <Grid item>
          <img src={Person} alt='Person' style={{ width: '40px' }} />
        </Grid>
        <Grid justifyContent='left' item xs zeroMinWidth>
          <h4 className='m-0 pt-1 text-base font-semibold text-gray-600'>{username}</h4>
          <p className='my-1'>{content}</p>
          <div className='flex flex-row justify-between'>
            <p className='text-gray-400 text-sm'>{timeSince(timestamp)}</p>
            {displayDelete && (
              <p
                className='text-red-400 underline text-sm hidden group-hover:block cursor-pointer hover:text-red-500'
                onClick={() => {
                  deleteComment(comment_id);
                }}
              >
                删除
              </p>
            )}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CommentBox;

import React from 'react';

import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface SwimlaneItemProps {
  title: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles(() => ({
  paperRoot: {
    // backgroundColor: '#f7f8f9'
  },
  button: {
    color: '#4285f4',
    borderColor: '#1a73e8',
    '&:hover': {
      color: '#1a73e8'
    }
  },
  cardHead: {
    // position: 'sticky',
    // top: '2px',
    backgroundColor: '#fff'
  }
}));

const Swimlane: React.FC<SwimlaneItemProps> = ({
  title,
  children
}) => {
  const classes = useStyles();

  const hasChildren = React.Children.count(children) > 0;
  return (
    <div className='flex justify-center flex-1 p-4 space-x-4 items-start' style={{ backgroundColor: '#eee' }}>
      <Paper
        classes={{ root: classes.paperRoot }}
        elevation={0}
        className='p-2 w-72 flex flex-col space-y-4'
        style={{ backgroundColor: '#eee' }}
      >
        <div className={`flex items-center p-2 justify-between border rounded-lg shadow ${classes.cardHead}`}>
          <h2 className='font-bold'>{title}</h2>
          <span className='bg-gray-200 text-gray-800 rounded-full px-2 py-1 text-sm'>
            {React.Children.count(children)}
          </span>
        </div>

        {hasChildren && <div className='flex flex-col space-y-2 overflow-y-auto'>{children}</div>}
      </Paper>
    </div>
  );
};

export default Swimlane;

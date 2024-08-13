import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Fade } from '@material-ui/core';
import Container from '@mui/material/Container';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Textarea } from '@mui/joy';
import Button from '@material-ui/core/Button';

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

interface ShareTaskProps {
  open: boolean;
  handleClose: () => void;
  setEmail: (email: string) => void;
  handleProjectShare: () => Promise<void>;
}

const ShareProjectModel: React.FC<ShareTaskProps> = ({ open, handleClose, setEmail, handleProjectShare }) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <div className='w-[60vh]'>
          <Container fixed className='flex flex-col px-4 pb-10 pt-8 bg-white'>
            <div className='flex items-center ml-5 mb-2 justify-between'>
              <h1 className='font-semibold text-2xl'> 添加成员 </h1>
              <IconButton className='rounded' onClick={handleClose}>
                {' '}
                <CloseOutlinedIcon />
              </IconButton>
            </div>
            <div className='flex flex-col mt-5 ml-5 mb-2'>
              <Textarea
                placeholder='电子邮件地址'
                maxRows={1}
                autoComplete={'email'}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              ></Textarea>
            </div>
            <div className='flex w-full mt-12 ml-auto flex-row-reverse'>
              <Button variant='contained' className={classes.createButton} onClick={handleProjectShare}>
                创建
              </Button>
            </div>
          </Container>
        </div>
      </Fade>
    </Modal>
  );
};

export default ShareProjectModel;

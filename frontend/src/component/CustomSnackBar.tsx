import React, { forwardRef, useState } from 'react';

import { Slide, SlideProps, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

interface SnackbarMessage {
  message: string;
  type: 'success' | 'error';
}

interface SnackbarProps {
  messageInfo: SnackbarMessage;
  onClose: () => void;
  isOpen?: boolean;
}

const SlideTransition = (props: SlideProps) => <Slide {...props} direction='left' />

export const CustomSnackbar: React.FC<SnackbarProps> = ({ messageInfo, onClose, isOpen = false }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isOpen}
      autoHideDuration={5000}
      onClose={onClose}
      TransitionComponent={SlideTransition}
    >
      {messageInfo && (
        <Alert onClose={onClose} severity={messageInfo.type}>
          {messageInfo.message}
        </Alert>
      )}
    </Snackbar>
  );
};

export const useCustomSnackbar = () => {
  const [message, setMessage] = useState<SnackbarMessage>({ message: '', type: 'success' });
  const [openMessage, setOpenMessage] = useState<boolean>(false);

  const info = (message: string, type: 'success' | 'error') => {
    setMessage({ message, type });
    setOpenMessage(true);
  };

  const closeInfo = () => {
    setOpenMessage(false);
  };

  return {
    message,
    openMessage,
    info,
    closeInfo
  };
};

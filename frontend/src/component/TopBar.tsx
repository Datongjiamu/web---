import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { Menu, MenuItem } from '@material-ui/core';

import menuButton from '../assets/menu.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100%',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: theme.zIndex.drawer + 1
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: '#fff'
    },
    title: {
      flexGrow: 1,
      color: '#fff'
    }
  })
);

interface TopBarProps {
  username?: string;
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ username, toggleSidebar }) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const _handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleClose = () => {
    setAnchorEl(null);
  };

  const apiUrl = import.meta.env.VITE_API_URL;

  async function handleLogout() {
    const response = await axios.get(`${apiUrl}/user/logout`);
    if (response.data.success) navigate('/login');
  }

  return (
    <div className={classes.root}>
      <AppBar elevation={0} style={{ backgroundColor: '#1183fb' }} position='static'>
        <Toolbar>
          <IconButton edge='start' className={classes.menuButton} aria-label='menu' onClick={toggleSidebar}>
            <img src={menuButton} alt='Add' className='w-6 h-6' />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            简易看板
          </Typography>

          <Button color='inherit' style={{ color: '#fff', textTransform: 'none' }} onClick={_handleClick}>
            <h2>{username}</h2>
          </Button>

          <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={_handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon className='mr-1' fontSize='small' />
              <h2 className='text-red-500'>退出</h2>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopBar;

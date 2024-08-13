import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import defaultTaskImg from '../assets/task.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      color: 'black'
    },
    button: {
      color: '#4285f4',
      borderColor: '#1a73e8',
      '&:hover': {
        color: '#1a73e8'
      }
    }
  })
);

interface TopBarProps {
  title: string;
  hasCreate: boolean;
  disabled?: boolean;
  setModelOpen?: (open: boolean) => void;
}

const TaskTopBar: React.FC<TopBarProps> = ({ title, hasCreate, disabled = false, setModelOpen = () => { } }) => {
  const classes = useStyles();
  return (
    <AppBar color='transparent' position='static'>
      <Toolbar className='flex items-center p-2 justify-between'>
        <div className='flex items-center'>
          {title && (<img src={defaultTaskImg} alt='Task' className='w-6 h-6 mr-2' />)}
          <Typography variant='h6' className={classes.title}>
            {title}
          </Typography>
        </div>

        <div>
          {hasCreate && (
            <Button
              className={classes.button}
              variant={'outlined'}
              disabled={disabled}
              onClick={() => {
                setModelOpen(true);
              }}
            >
              + 创建
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TaskTopBar;

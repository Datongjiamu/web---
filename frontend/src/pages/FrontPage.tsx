import { useNavigate } from 'react-router-dom';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import ParticlesBg from 'particles-bg';

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

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/workspace');
  };

  return (
    <>
      <div className='h-screen flex flex-col justify-center items-center text-center'>
        <h1 className='text-8xl mb-32'>简易看板</h1>
        <div>
          <Button className={classes.button} size='large' variant='contained' onClick={handleClick}>
            开始使用
          </Button>
        </div>
      </div>
      <ParticlesBg type='circle' bg={true} />
    </>
  );
};

export default HomePage;

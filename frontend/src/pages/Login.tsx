import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { CustomSnackbar, useCustomSnackbar } from '../component/CustomSnackBar';
import { apiUrl, PasswordTextfield, TimeWait } from '../component/Common';
import loginBox from '../assets/login-box-bg.svg';

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

export default function Login() {
  const [errors, setErrors] = useState({
    username: false,
    password: false
  });

  const { message, openMessage, info, closeInfo } = useCustomSnackbar();
  const navigate = useNavigate();
  const classes = useStyles();

  const _handleRegister = () => navigate('/register');
  const _handleForgotPassword = () => navigate('/forgot-password');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const result = await axios.get(`${apiUrl}/user/verifyToken`);
      if (result.data.success) {
        const username = result.data.value;
        navigate('/workspace', { state: { username } });
      }
    };

    checkLoginStatus();
  }, [apiUrl, navigate]);

  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const values = {
      username: data.get('username'),
      password: data.get('password')
    };

    const newErrors = {
      username: false,
      password: false
    };

    let hasErrors = false;

    for (const key in values) {
      if (values[key as keyof typeof values] === '' || values[key as keyof typeof values] === null) {
        newErrors[key as keyof typeof values] = true;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      info('还有必填项没有填写！', 'error');
      setErrors(newErrors);
      return;
    }

    setErrors(newErrors);

    try {
      const response = await axios.post(`${apiUrl}/user/login`, { username: values.username, password: values.password });
      if (response.data.success) {
        info('登录成功', 'success');
        await TimeWait(2000);
        const username = response.data.value;
        navigate('/workspace', { state: { username } });
      } else info('用户名或密码错误！', 'error');
    } catch (error) {
      info('用户名或密码错误！', 'error');
    }
  };

  return (
    <div className='h-full w-full bg-gray-50'>
      <div className='h-full pb-10 flex flex-1'>
        <div className='flex justify-center items-center flex-col pb-10' style={{ width: '50%' }}>
          <img src={loginBox} alt='img' />
          <h2 style={{ fontSize: '30px', marginTop: '-70px' }}>简易看板</h2>
        </div>
        
        <div className='flex justify-center items-center' style={{ width: '50%' }}>
          <Container className='py-20' maxWidth='sm'>
            <Box
              className='bg-white'
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 3,
                py: 6,
                mx: 6,
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography component='h1' variant='h5'>
                登录
              </Typography>
              <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='username'
                  label='用户名'
                  name='username'
                  autoComplete='username'
                  autoFocus
                  error={errors.username}
                />
                <PasswordTextfield label='密码' name='password' error={errors.password} />
                <FormControlLabel
                  control={<Checkbox value='remember' color='primary' />}
                  label='记住我'
                  className='px-3 pt-4'
                />
                <Box className='py-4'>
                  <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} className={classes.button}>
                    <h2 className='my-3 font-semibold text-white'>登录</h2>
                  </Button>
                </Box>
                <Grid container className='pt-2'>
                  <Grid item xs>
                    <Link href='#' variant='body2' onClick={_handleForgotPassword}>
                      {'忘记密码?'}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href='#' variant='body2' onClick={_handleRegister}>
                      {'注册账号'}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
              <CustomSnackbar messageInfo={message} onClose={() => closeInfo()} isOpen={openMessage} />
            </Box>
          </Container>
        </div>
      </div>
    </div>
  );
}

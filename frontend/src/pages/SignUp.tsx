import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { apiUrl, PasswordTextfield, TimeWait } from '../component/Common';
import { CustomSnackbar, useCustomSnackbar } from '../component/CustomSnackBar';
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

export default function SignIn() {
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const { message, openMessage, info, closeInfo } = useCustomSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const response = await axios.get(`${apiUrl}/user/verifyToken`);
      if (response.data.success) {
        const username = response.data.value;
        navigate('/workspace', { state: { username } });
      }
    };

    checkLoginStatus();
  }, [apiUrl, navigate]);

  const handleBack = () => {
    navigate('/login');
  };

  const _handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword')
    };
    const newErrors = {
      username: false,
      email: false,
      password: false,
      confirmPassword: false
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

    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const emailStr = values.email!.toString();
    if (!emailRegex.test(emailStr)) {
      info('请输入有效的电子邮件地址!', 'error');
      return;
    }

    const pwdStr = values.password!.toString();
    if (pwdStr.length < 6) {
      newErrors.password = true;
      setErrors(newErrors);
      info('密码至少需要有6个字符！', 'error');
      return;
    }

    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = true;
      setErrors(newErrors);
      info('确认密码不匹配！', 'error');
      return;
    }
    setErrors(newErrors);

    try {
      //console.log(`${apiUrl}/user/register`)
      const response = await axios.post(`${apiUrl}/user/register`, {
        username: values.username,
        email: values.email,
        password: values.password
      });
      console.log(response.data);
      if (response.data.success) {
        info('注册成功', 'success');
        await TimeWait(2000);
        navigate('/login');
      } else if (response.data.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email') {
        info('注册失败,此邮箱已被使用', 'error');
      } else {
        info('注册失败,ERR_MSG:' + response.data.message, 'error');
      }
    } catch (error) {
      info('注册失败，请重试', 'error');
    }
  };

  const classes = useStyles();

  return (
    <div className='h-full w-full bg-gray-50'>
      <div className='h-full pb-10 flex flex-1'>
        <div className='flex justify-center items-center flex-col pb-10' style={{ width: '50%' }}>
          <img src={loginBox} alt='img' />
          <h2 style={{ fontSize: '30px', marginTop: '-70px' }}>简易看板</h2>
        </div>

        <div className='flex justify-center items-center' style={{ width: '50%' }}>
          <Container className='py-16' maxWidth='sm'>
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
                注册
              </Typography>
              <Box component='form' onSubmit={_handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='username'
                  label='用户名'
                  name='username'
                  autoComplete='username'
                  error={errors.username}
                  autoFocus
                />
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label='电子邮件地址'
                  name='email'
                  autoComplete='email'
                  error={errors.email}
                />
                <PasswordTextfield label='密码' name='password' error={errors.password} />
                <PasswordTextfield label='确认密码' name='confirmPassword' error={errors.confirmPassword} />
                <Box className='pt-6'>
                  <Button variant='contained' type='submit' fullWidth className={classes.button}>
                    <h2 className='my-3 font-semibold text-white'>注册</h2>
                  </Button>
                </Box>
                <Grid container className='pt-2'>
                  <Grid item xs></Grid>
                  <Grid item>
                    <Link href='#' variant='body2' onClick={handleBack}>
                      {'返回'}
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

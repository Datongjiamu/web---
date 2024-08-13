import React, { ChangeEventHandler } from 'react';

import { InputAdornment } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import Person from '../assets/person.svg';

export const apiUrl = import.meta.env.VITE_API_URL;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3)
    }
  })
);

interface AvatarWithNameProps {
  src: string;
  name: string;
}

export const AvatarWithName: React.FC<AvatarWithNameProps> = ({ src, name }) => {
  const classes = useStyles();
  return (
    <div className='flex'>
      <img src={Person} alt='Person' style={{ width: '20px' }} />

      <h4 className='ml-2 text-gray-600'>{name}</h4>
    </div>
  );
};

interface DateYMDProps {
  year: number;
  month: number;
  day: number;
}

export const DateYMD: React.FC<DateYMDProps> = ({ year, month, day }) => {
  return (
    <h5 className='text-sm'>
      {year}年{month}月{day}日
    </h5>
  );
};

export function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface DateSelectorProps {
  label: string;
  defaultValue?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ label, defaultValue = getDate(), onChange }) => {
  return (
    <form className='flex flex-wrap' noValidate>
      <TextField
        id='date'
        label={label}
        type='date'
        defaultValue={defaultValue}
        InputLabelProps={{
          shrink: true
        }}
        onChange={onChange}
      />
    </form>
  );
};

interface PasswordTextfieldProps {
  label: string;
  name: string;
  error?: boolean;
}

export const PasswordTextfield: React.FC<PasswordTextfieldProps> = ({ label, name, error = false }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <TextField
      margin='normal'
      required
      fullWidth
      type={showPassword ? 'text' : 'password'}
      label={label}
      name={name}
      error={error}
      InputProps={{
        endAdornment: (
          <InputAdornment position='start'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export const TimeWait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

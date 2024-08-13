import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from '../pages/WorkSpace';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import ForgetPassword from '../pages/ForgetPassword';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/workspace' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/' element={<Login />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;

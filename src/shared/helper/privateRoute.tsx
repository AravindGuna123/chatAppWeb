import React from 'react';
import { Navigate } from 'react-router-dom';
import { getLocalStorage } from '../utils';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = getLocalStorage('token');
  console.log(token, "tok");

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

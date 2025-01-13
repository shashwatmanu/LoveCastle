import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" replace />;
  // return children
};

export const PublicRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? <Navigate to="/swipe" replace /> : children;
};

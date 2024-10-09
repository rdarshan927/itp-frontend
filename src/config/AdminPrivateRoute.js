import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
  const admin = localStorage.getItem('loggedInAdmin'); 

  return admin ? children : <Navigate to="/AdminLogin" />;
};

export default AdminPrivateRoute;

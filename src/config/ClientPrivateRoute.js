import React from 'react';
import { Navigate } from 'react-router-dom';

const ClientPrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    const isAuthenticated = !!token; 
  
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ClientPrivateRoute;

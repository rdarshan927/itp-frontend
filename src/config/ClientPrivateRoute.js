import React from 'react';
import { Navigate } from 'react-router-dom';

const ClientPrivateRoute = ({ children }) => {
    const user = localStorage.getItem('loggedCustomer');

    return user ? children : <Navigate to="/login" />;
};

export default ClientPrivateRoute;

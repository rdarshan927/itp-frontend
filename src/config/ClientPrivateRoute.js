/**
 * Licensed under the Shepora Flower Plant Management System License (v1.0)
 * See the LICENSE.txt file for more details.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const ClientPrivateRoute = ({ children }) => {
    const user = localStorage.getItem('loggedCustomer');

    return user ? children : <Navigate to="/login" />;
};

export default ClientPrivateRoute;

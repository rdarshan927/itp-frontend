/**
 * Licensed under the Shepora Flower Plant Management System License (v1.0)
 * See the LICENSE.txt file for more details.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({ children }) => {
  const admin = localStorage.getItem('loggedInAdmin'); 

  return admin ? children : <Navigate to="/AdminLogin" />;
};

export default AdminPrivateRoute;

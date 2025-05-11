import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkIfLoggedInUser } from '../core/services/LoginService';

const ProtectedRoute: React.FC = () => {
  return checkIfLoggedInUser() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 
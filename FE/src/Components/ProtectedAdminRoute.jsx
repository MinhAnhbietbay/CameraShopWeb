import React from 'react';
import { Navigate } from 'react-router-dom';
import { authApi } from '../services/authApi';

const ProtectedAdminRoute = ({ children }) => {
  const user = authApi.getCurrentUser();
  
  if (!user) {
    // Nếu chưa đăng nhập, chuyển về trang login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Nếu không phải admin, chuyển về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu là admin, render children
  return children;
};

export default ProtectedAdminRoute; 
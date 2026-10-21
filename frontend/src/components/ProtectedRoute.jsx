// frontend/src/components/ProtectedRoute.jsx
// Route wrapper to guard authenticated routes and enforce user roles

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, requiredRole, children }) {
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required (e.g. 'admin') and user doesn't match, block access
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container error-container">
        <h2>Access Denied</h2>
        <p>You do not have sufficient permissions to view this page.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;

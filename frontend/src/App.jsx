// frontend/src/App.jsx
// Root application component managing user auth state and client-side routing

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketCreatePage from './pages/TicketCreatePage';
import TicketEditPage from './pages/TicketEditPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  // Initialize user and token state from localStorage (beginner-friendly pattern)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('helpdesk_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('helpdesk_token') || null;
  });

  // Handler for successful login or registration
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('helpdesk_user', JSON.stringify(userData));
    localStorage.setItem('helpdesk_token', userToken);
  };

  // Handler for user logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('helpdesk_user');
    localStorage.removeItem('helpdesk_token');
  };

  return (
    <div className="app-layout">
      {/* Navbar with role-aware links and logout */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          {/* Default redirect: send to /tickets if logged in, otherwise /login */}
          <Route
            path="/"
            element={<Navigate to={user ? '/tickets' : '/login'} replace />}
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/tickets" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/tickets" replace />
              ) : (
                <RegisterPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Protected Customer Ticket Routes */}
          <Route
            path="/tickets"
            element={
              <ProtectedRoute user={user}>
                <TicketListPage token={token} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute user={user}>
                <TicketCreatePage token={token} />
              </ProtectedRoute>
            }
          />

          {/* Dynamic route using useParams */}
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute user={user}>
                <TicketDetailPage token={token} user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id/edit"
            element={
              <ProtectedRoute user={user}>
                <TicketEditPage token={token} />
              </ProtectedRoute>
            }
          />

          {/* =================================================================
              TODO (Student tasks for remaining assignment requirements):
              - Admin Ticket Management:
                <Route path="/admin/tickets" element={
                  <ProtectedRoute user={user} requiredRole="admin">
                    <AdminTicketListPage token={token} />
                  </ProtectedRoute>
                } />
              - Admin Department CRUD:
                <Route path="/admin/departments" element={
                  <ProtectedRoute user={user} requiredRole="admin">
                    <DepartmentListPage token={token} />
                  </ProtectedRoute>
                } />
              - Admin Analytics Dashboard:
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute user={user} requiredRole="admin">
                    <AdminDashboardPage token={token} />
                  </ProtectedRoute>
                } />
              ================================================================= */}

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

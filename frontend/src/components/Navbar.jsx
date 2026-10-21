// frontend/src/components/Navbar.jsx
// Main navigation bar with role-aware NavLinks and Logout

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to={user ? '/tickets' : '/login'} className="navbar-brand">
          <span className="brand-icon">🎫</span>
          <span className="brand-text">Helpdesk Support</span>
        </NavLink>

        <nav className="navbar-links">
          {user ? (
            <>
              <NavLink
                to="/tickets"
                end
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                My Tickets
              </NavLink>

              <NavLink
                to="/tickets/new"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                + New Ticket
              </NavLink>

              {user.role === 'admin' && (
                <span className="admin-badge" title="Admin privileges enabled">
                  Admin
                </span>
              )}

              <div className="user-section">
                <span className="user-greeting">
                  👤 {user.name} <small>({user.role})</small>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

// frontend/src/pages/NotFoundPage.jsx
// 404 Fallback page for unmatched client-side routes

import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container page-container not-found-container">
      <div className="card text-center" style={{ padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 1rem' }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ color: '#666', margin: '1rem 0 2rem' }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/tickets" className="btn btn-primary">
          Go to Home / My Tickets
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;

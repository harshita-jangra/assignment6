// frontend/src/pages/TicketListPage.jsx
// Displays the customer's tickets with status badges, filters, and full loading/error/empty states

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyTickets, deleteTicket } from '../api/ticketApi';

function TicketListPage({ token }) {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionMessage, setActionMessage] = useState(null);

  // Load customer tickets from backend
  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMyTickets(token);
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message || 'Failed to load tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [token]);

  // Handle ticket deletion (enforcing Open status check on frontend & backend)
  const handleDelete = async (id, status, ticketId) => {
    if (status !== 'Open') {
      alert(`Cannot delete ticket '${ticketId}'. Only tickets with status 'Open' can be deleted.`);
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ticket ${ticketId}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteTicket(id, token);
      setActionMessage({ type: 'success', text: `Ticket ${ticketId} was successfully deleted.` });
      // Remove ticket from local state
      setTickets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Could not delete ticket.' });
    }
  };

  // Filter tickets based on status tab
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter === 'ALL') return true;
    return ticket.status === statusFilter;
  });

  return (
    <div className="container page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>My Helpdesk Tickets</h1>
          <p className="subtitle">Track complaints, check statuses, and manage your tickets</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">
          + Raise New Ticket
        </Link>
      </div>

      {/* Action alert message */}
      {actionMessage && (
        <div className={`alert alert-${actionMessage.type}`}>
          {actionMessage.text}
          <button
            type="button"
            className="alert-close"
            onClick={() => setActionMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-bar">
        <span className="filter-label">Filter by Status:</span>
        {['ALL', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
          <button
            key={status}
            type="button"
            className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 1. Loading State */}
      {isLoading && (
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p>Loading your tickets...</p>
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && (
        <div className="state-box error-box">
          <p className="error-title">⚠️ Error loading tickets</p>
          <p>{error}</p>
          <button
            type="button"
            onClick={loadTickets}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && !error && filteredTickets.length === 0 && (
        <div className="state-box empty-box">
          <span className="empty-icon">📭</span>
          <h3>No tickets found</h3>
          <p>
            {statusFilter === 'ALL'
              ? "You haven't submitted any helpdesk complaints yet."
              : `You have no tickets currently marked as '${statusFilter}'.`}
          </p>
          {statusFilter === 'ALL' && (
            <Link to="/tickets/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Create Your First Ticket
            </Link>
          )}
        </div>
      )}

      {/* 4. Loaded Data State */}
      {!isLoading && !error && filteredTickets.length > 0 && (
        <div className="ticket-grid">
          {filteredTickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card card">
              <div className="ticket-card-header">
                <span className="ticket-code">{ticket.ticketId || 'TKT'}</span>
                <div className="badge-group">
                  <span className={`badge badge-priority-${ticket.priority?.toLowerCase()}`}>
                    {ticket.priority} Priority
                  </span>
                  <span className={`badge badge-status-${ticket.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <h3 className="ticket-title">
                <Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link>
              </h3>

              <p className="ticket-category">
                <strong>Category:</strong> {ticket.category}
              </p>

              <p className="ticket-snippet">
                {ticket.description.length > 110
                  ? `${ticket.description.substring(0, 110)}...`
                  : ticket.description}
              </p>

              <div className="ticket-footer">
                <span className="ticket-date">
                  📅 {new Date(ticket.createdAt).toLocaleDateString()}
                </span>

                <div className="ticket-actions">
                  <Link
                    to={`/tickets/${ticket._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    View
                  </Link>

                  {/* Customer can only edit/delete while status is Open */}
                  {ticket.status === 'Open' ? (
                    <>
                      <Link
                        to={`/tickets/${ticket._id}/edit`}
                        className="btn btn-sm btn-edit"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(ticket._id, ticket.status, ticket.ticketId)}
                        className="btn btn-sm btn-delete"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <span
                      className="locked-hint"
                      title="Tickets cannot be edited or deleted once In Progress, Resolved, or Closed"
                    >
                      🔒 Locked ({ticket.status})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketListPage;

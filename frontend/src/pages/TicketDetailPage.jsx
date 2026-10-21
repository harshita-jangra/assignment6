// frontend/src/pages/TicketDetailPage.jsx
// Displays complete ticket details using useParams, status badge, and student extension areas

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchTicketById, deleteTicket } from '../api/ticketApi';

function TicketDetailPage({ token, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTicket = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchTicketById(id, token);
        setTicket(data.ticket);
      } catch (err) {
        setError(err.message || 'Could not load ticket.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [id, token]);

  const handleDelete = async () => {
    if (!ticket) return;

    if (ticket.status !== 'Open') {
      alert("Tickets can only be deleted while they are in 'Open' status.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to delete ticket ${ticket.ticketId}?`
    );
    if (!confirm) return;

    try {
      await deleteTicket(ticket._id, token);
      alert('Ticket deleted successfully.');
      navigate('/tickets');
    } catch (err) {
      alert(err.message || 'Error deleting ticket.');
    }
  };

  if (isLoading) {
    return (
      <div className="container page-container">
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container page-container">
        <div className="state-box error-box">
          <p className="error-title">⚠️ Error</p>
          <p>{error || 'Ticket could not be found.'}</p>
          <Link to="/tickets" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  const isEditable = ticket.status === 'Open';

  return (
    <div className="container page-container">
      {/* Navigation breadcrumb */}
      <div className="breadcrumb">
        <Link to="/tickets">← Back to My Tickets</Link>
      </div>

      <div className="card detail-card">
        {/* Detail Header */}
        <div className="detail-header">
          <div>
            <div className="detail-meta-top">
              <span className="ticket-code-lg">{ticket.ticketId}</span>
              <span className="ticket-category-pill">{ticket.category}</span>
            </div>
            <h1 className="detail-title">{ticket.title}</h1>
          </div>

          <div className="detail-badges">
            <span className={`badge badge-priority-${ticket.priority?.toLowerCase()}`}>
              {ticket.priority} Priority
            </span>
            <span className={`badge badge-status-${ticket.status?.toLowerCase().replace(/\s+/g, '-')}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        {/* Timestamps & Info */}
        <div className="detail-info-row">
          <div>
            <strong>Created by:</strong> {ticket.createdBy?.name || 'Customer'} (
            {ticket.createdBy?.email})
          </div>
          <div>
            <strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Last Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}
          </div>
        </div>

        <hr className="divider" />

        {/* Issue Description */}
        <div className="detail-section">
          <h3>Issue Description</h3>
          <p className="description-text">{ticket.description}</p>
        </div>

        {/* Optional Screenshot */}
        {ticket.screenshotUrl && (
          <div className="detail-section">
            <h3>Attached Screenshot</h3>
            <div className="screenshot-wrapper">
              <a
                href={ticket.screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="screenshot-link"
              >
                View Full Screenshot ↗
              </a>
              <div className="screenshot-preview">
                <img
                  src={ticket.screenshotUrl}
                  alt="Ticket screenshot"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <hr className="divider" />

        {/* Action Controls */}
        <div className="detail-actions">
          {isEditable ? (
            <>
              <Link to={`/tickets/${ticket._id}/edit`} className="btn btn-primary">
                Edit Ticket
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-delete"
              >
                Delete Ticket
              </button>
            </>
          ) : (
            <div className="alert alert-info" style={{ margin: 0 }}>
              🔒 <strong>Locked:</strong> This ticket is currently <em>{ticket.status}</em>.
              According to helpdesk rules, customers can only edit or delete tickets when they are Open.
            </div>
          )}

          <Link to="/tickets" className="btn btn-secondary" style={{ marginLeft: 'auto' }}>
            Back to List
          </Link>
        </div>
      </div>

      {/* =========================================================================
          STUDENT TODO SECTION:
          Leave for student to implement remaining features:
          1. Comment Thread (Customer & Support replies with timestamps)
          2. Ticket Reopening (If ticket is Resolved, show 'Reopen Ticket' button)
          3. Department Assignment (Support can assign ticket to Department)
          ========================================================================= */}
      <div className="card placeholder-card">
        <h3>💬 Ticket Discussion & Updates (Next Step for You)</h3>
        <p className="placeholder-text">
          <em>
            This section is prepared for you to add the <strong>Comment Thread</strong> feature.
            Customers and support staff will post replies here.
          </em>
        </p>
        <div className="todo-box">
          <strong>Your Implementation Checklist:</strong>
          <ul>
            <li>Create the <code>Comment</code> model on the backend.</li>
            <li>Add <code>GET /api/comments/:ticketId</code> and <code>POST /api/comments/:ticketId</code> routes.</li>
            <li>Render comment items and an input form here.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailPage;

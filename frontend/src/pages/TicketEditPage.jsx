// frontend/src/pages/TicketEditPage.jsx
// Form page for updating an existing ticket using the shared TicketForm component

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTicketById, updateTicket } from '../api/ticketApi';
import TicketForm from '../components/TicketForm';

function TicketEditPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Load current ticket values
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await fetchTicketById(id, token);
        setTicket(data.ticket);
      } catch (err) {
        setLoadError(err.message || 'Failed to load ticket.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, token]);

  const handleUpdate = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await updateTicket(id, formData, token);
      navigate(`/tickets/${id}`);
    } catch (err) {
      setServerError(err.message || 'Failed to update ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container form-page-container">
        <div className="state-box loading-box">
          <div className="spinner"></div>
          <p>Loading ticket information...</p>
        </div>
      </div>
    );
  }

  if (loadError || !ticket) {
    return (
      <div className="container form-page-container">
        <div className="state-box error-box">
          <p className="error-title">⚠️ Error</p>
          <p>{loadError || 'Ticket not found.'}</p>
          <Link to="/tickets" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  // BUSINESS RULE: Customer can only edit a ticket while it is Open
  if (ticket.status !== 'Open') {
    return (
      <div className="container form-page-container">
        <div className="card">
          <h2>Editing Not Allowed</h2>
          <div className="alert alert-error">
            This ticket is currently marked as <strong>{ticket.status}</strong>. Tickets can only be edited while their status is <strong>Open</strong>.
          </div>
          <Link to={`/tickets/${ticket._id}`} className="btn btn-primary">
            View Ticket Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container form-page-container">
      <div className="breadcrumb">
        <Link to={`/tickets/${ticket._id}`}>← Back to Ticket ({ticket.ticketId})</Link>
      </div>

      <div className="form-page-header">
        <h1>Edit Ticket {ticket.ticketId}</h1>
        <p>Modify the details of your open complaint ticket.</p>
      </div>

      <TicketForm
        initialData={ticket}
        onSubmit={handleUpdate}
        buttonText="Update Ticket"
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </div>
  );
}

export default TicketEditPage;

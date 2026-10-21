// frontend/src/pages/TicketCreatePage.jsx
// Form page for creating a new helpdesk ticket using the shared TicketForm component

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from '../api/ticketApi';
import TicketForm from '../components/TicketForm';

function TicketCreatePage({ token }) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await createTicket(formData, token);
      // Redirect to the created ticket detail or ticket list
      if (response.ticket && response.ticket._id) {
        navigate(`/tickets/${response.ticket._id}`);
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to submit ticket. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container form-page-container">
      <div className="breadcrumb">
        <Link to="/tickets">← Back to My Tickets</Link>
      </div>

      <div className="form-page-header">
        <h1>Submit a Helpdesk Ticket</h1>
        <p>Provide details about the problem and our support team will assist you.</p>
      </div>

      <TicketForm
        onSubmit={handleCreate}
        buttonText="Submit Ticket"
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </div>
  );
}

export default TicketCreatePage;

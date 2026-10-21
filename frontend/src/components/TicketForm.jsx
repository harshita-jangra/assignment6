// frontend/src/components/TicketForm.jsx
// Reusable form component used for both Creating and Editing a Ticket

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TicketForm({
  initialData = {},
  onSubmit,
  buttonText = 'Submit Ticket',
  isSubmitting = false,
  serverError = null,
}) {
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    priority: 'Low',
    description: '',
    screenshotUrl: '',
  });

  const [clientError, setClientError] = useState('');

  // Pre-fill form when editing an existing ticket
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Technical',
        priority: initialData.priority || 'Low',
        description: initialData.description || '',
        screenshotUrl: initialData.screenshotUrl || '',
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with basic validation
  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!formData.title.trim()) {
      setClientError('Please enter a ticket title.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setClientError('Description must be at least 10 characters long.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card">
      {/* Show error messages if any */}
      {(clientError || serverError) && (
        <div className="alert alert-error">
          {clientError || serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Cannot connect to VPN server"
          required
          className="form-control"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-row">
        <div className="form-group form-col">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            disabled={isSubmitting}
          >
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="form-group form-col">
          <label htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="form-control"
            disabled={isSubmitting}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe the issue in detail, steps to reproduce, or error messages received..."
          required
          className="form-control"
          disabled={isSubmitting}
        />
        <small className="help-text">Minimum 10 characters.</small>
      </div>

      <div className="form-group">
        <label htmlFor="screenshotUrl">
          Screenshot URL <small>(Optional)</small>
        </label>
        <input
          type="url"
          id="screenshotUrl"
          name="screenshotUrl"
          value={formData.screenshotUrl}
          onChange={handleChange}
          placeholder="https://example.com/screenshot.png"
          className="form-control"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>

        <button
          type="button"
          onClick={() => navigate('/tickets')}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TicketForm;

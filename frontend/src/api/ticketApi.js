// frontend/src/api/ticketApi.js
// API helper functions for Ticket CRUD operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Fetch all tickets created by the logged-in customer
export const fetchMyTickets = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tickets/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tickets.');
  }

  return data;
};

// Fetch single ticket details by ID
export const fetchTicketById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load ticket details.');
  }

  return data;
};

// Create a new support ticket
export const createTicket = async (ticketData, token) => {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create ticket.');
  }

  return data;
};

// Update an existing ticket
export const updateTicket = async (id, ticketData, token) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update ticket.');
  }

  return data;
};

// Delete a ticket
export const deleteTicket = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete ticket.');
  }

  return data;
};

// backend/controllers/ticketController.js
// Controller logic for Ticket creation, retrieval, updates, and business rule enforcement

const Ticket = require('../models/Ticket');

// Helper to generate a unique readable ticket ID like TKT-1001
const generateTicketId = async () => {
  // Count existing tickets to form sequential number
  const totalTickets = await Ticket.countDocuments();
  const nextNumber = 1001 + totalTickets;
  let candidateId = `TKT-${nextNumber}`;

  // Check if candidateId already exists (edge case guard)
  const existing = await Ticket.findOne({ ticketId: candidateId });
  if (existing) {
    candidateId = `TKT-${Date.now().toString().slice(-4)}`;
  }
  return candidateId;
};

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private (Customer / Admin)
const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority, screenshotUrl } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category.',
      });
    }

    // Auto-generate readable ticket ID
    const ticketId = await generateTicketId();

    const ticket = await Ticket.create({
      ticketId,
      title,
      description,
      category,
      priority: priority || 'Low',
      screenshotUrl: screenshotUrl || '',
      status: 'Open',
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Ticket created successfully.',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tickets raised by current logged-in customer
// @route   GET /api/tickets/my
// @access  Private (Customer)
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket details by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    // Authorization check: Customer can only view their own ticket; Admin can view any
    const isOwner = ticket.createdBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ticket.',
      });
    }

    return res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a ticket (Customer)
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    // Check ownership
    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to edit this ticket.',
      });
    }

    // BUSINESS RULE: Customer can edit a ticket ONLY while it is "Open"
    if (!isAdmin && ticket.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: `Tickets can only be edited while they are Open. Current status is '${ticket.status}'.`,
      });
    }

    const { title, description, category, priority, screenshotUrl } = req.body;

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (screenshotUrl !== undefined) ticket.screenshotUrl = screenshotUrl;

    const updatedTicket = await ticket.save();

    return res.status(200).json({
      success: true,
      message: 'Ticket updated successfully.',
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a ticket (Customer)
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    // Check ownership
    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this ticket.',
      });
    }

    // BUSINESS RULE: Customer can delete a ticket ONLY while it is "Open"
    if (!isAdmin && ticket.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: `Tickets can only be deleted while they are Open. Current status is '${ticket.status}'.`,
      });
    }

    await ticket.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================================
   TODO (Student tasks for remaining assignment requirements):
   1. getAllTicketsAdmin:
      - GET /api/tickets/admin/all
      - Allow filtering by status, priority, category
   2. updateTicketStatusAdmin:
      - PATCH /api/tickets/:id/status
      - Status workflow: Open -> In Progress -> Resolved -> Closed
   3. assignDepartmentAdmin:
      - PATCH /api/tickets/:id/assign
      - Assign ticket to a Department ObjectId
   4. reopenTicketCustomer:
      - POST /api/tickets/:id/reopen
      - Reopen a Resolved ticket (allowed only once, if reopenCount === 0)
   5. getDashboardMetrics:
      - GET /api/tickets/admin/dashboard
      - Aggregation pipeline for counts, priority breakdown, resolution time
   ========================================================================= */

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
};

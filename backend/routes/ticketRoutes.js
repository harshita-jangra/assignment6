// backend/routes/ticketRoutes.js
// Routes for managing customer tickets

const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { authHandler } = require('../middleware/authMiddleware');

// All ticket routes require authentication
router.use(authHandler);

// Customer ticket routes
router.route('/')
  .post(createTicket);

router.route('/my')
  .get(getMyTickets);

router.route('/:id')
  .get(getTicketById)
  .put(updateTicket)
  .delete(deleteTicket);

/* =========================================================================
   TODO (Student tasks for remaining assignment requirements):
   - Admin routes:
     router.get('/admin/all', allowRoles('admin'), getAllTicketsAdmin);
     router.patch('/admin/:id/status', allowRoles('admin'), updateStatusAdmin);
     router.patch('/admin/:id/assign', allowRoles('admin'), assignDepartmentAdmin);
     router.get('/admin/dashboard', allowRoles('admin'), getDashboardStatsAdmin);
   ========================================================================= */

module.exports = router;

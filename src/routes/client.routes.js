const express = require('express');
const router = express.Router();

// Import controllers
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientDashboard
} = require('../controllers/client.controller');

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Use authentication middleware for all routes
router.use(protect);

// Routes for admins and managers
router.route('/')
  .get(authorize('admin', 'manager'), getClients)
  .post(authorize('admin', 'manager'), createClient);

// Routes for clients to get their own dashboard data
router.get('/dashboard', authorize('client'), getClientDashboard);

// Routes for specific client
router.route('/:id')
  .get(authorize('admin', 'manager', 'client'), getClient)
  .put(authorize('admin', 'manager'), updateClient)
  .delete(authorize('admin'), deleteClient);

module.exports = router;
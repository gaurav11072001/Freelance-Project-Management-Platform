const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { projectValidation, bidValidation } = require('../middleware/validate');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Clients only)
router.post('/', 
  auth,
  projectValidation,
  projectController.createProject
);

// @route   GET /api/projects
// @desc    Get all projects with filters
// @access  Private
router.get('/',
  auth,
  projectController.getProjects
);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id',
  auth,
  projectController.getProjectById
);

// @route   POST /api/projects/:id/bid
// @desc    Submit a bid on a project
// @access  Private (Freelancers only)
router.post('/:id/bid',
  auth,
  bidValidation,
  projectController.submitBid
);

// @route   POST /api/projects/:projectId/bid/:bidId/accept
// @desc    Accept a bid
// @access  Private (Project owner only)
router.post('/:projectId/bid/:bidId/accept',
  auth,
  projectController.acceptBid
);

module.exports = router;

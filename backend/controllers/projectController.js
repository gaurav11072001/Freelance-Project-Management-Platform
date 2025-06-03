const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Helper function to check if a string is a valid ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = new Project({
      ...req.body,
      client: req.user.userId
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects with filters
exports.getProjects = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      minBudget, 
      maxBudget, 
      skills,
      search
    } = req.query;

    let query = {};

    // Add filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = minBudget;
      if (maxBudget) query.budget.$lte = maxBudget;
    }
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .populate('client', 'username email profile')
      .populate('freelancer', 'username email profile')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if id is a valid ObjectId
    if (!isValidObjectId(id)) {
      // For development, return mock project data
      return res.json({
        _id: id,
        title: 'Sample Project',
        description: 'This is a sample project for development purposes.',
        budget: 1500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'Web Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        status: 'open',
        createdAt: new Date(),
        client: {
          _id: 'client123',
          username: 'ClientUser',
          email: 'client@example.com',
          profile: { avatar: 'https://via.placeholder.com/150' }
        },
        bids: [
          {
            _id: 'bid1',
            freelancer: {
              _id: 'freelancer123',
              username: 'FreelancerUser',
              email: 'freelancer@example.com',
              profile: { avatar: 'https://via.placeholder.com/150' }
            },
            amount: 1200,
            deliveryTime: 14,
            proposal: 'I can deliver this project with high quality.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
      });
    }
    
    const project = await Project.findById(id)
      .populate('client', 'username email profile')
      .populate('freelancer', 'username email profile')
      .populate('bids.freelancer', 'username email profile');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit bid
exports.submitBid = async (req, res) => {
  try {
    const { amount, proposal, timeframe } = req.body;
    const id = req.params.id;
    
    // Check if id is a valid ObjectId
    if (!isValidObjectId(id)) {
      // For development, return mock project data with the new bid
      const mockProject = {
        _id: id,
        title: 'Sample Project',
        description: 'This is a sample project for development purposes.',
        budget: 1500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'Web Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        status: 'open',
        createdAt: new Date(),
        client: {
          _id: 'client123',
          username: 'ClientUser',
          email: 'client@example.com',
          profile: { avatar: 'https://via.placeholder.com/150' }
        },
        bids: [
          {
            _id: 'bid1',
            freelancer: {
              _id: 'freelancer123',
              username: 'FreelancerUser',
              email: 'freelancer@example.com',
              profile: { avatar: 'https://via.placeholder.com/150' }
            },
            amount: 1200,
            deliveryTime: 14,
            proposal: 'I can deliver this project with high quality.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            _id: 'newbid' + Date.now(),
            freelancer: {
              _id: req.user.userId || 'currentuser123',
              username: 'CurrentUser',
              email: 'currentuser@example.com',
              profile: { avatar: 'https://via.placeholder.com/150' }
            },
            amount: amount || 1300,
            deliveryTime: timeframe || 10,
            proposal: proposal || 'This is my proposal for the project.',
            createdAt: new Date(),
            status: 'pending'
          }
        ]
      };
      
      return res.json(mockProject);
    }
    
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Project is not open for bids' });
    }

    // Check if user already submitted a bid
    if (project.bids.some(bid => bid.freelancer.toString() === req.user.userId)) {
      return res.status(400).json({ message: 'You have already submitted a bid' });
    }

    project.bids.push({
      freelancer: req.user.userId,
      amount,
      proposal,
      timeframe
    });

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept bid
exports.acceptBid = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const bidId = req.params.bidId;
    
    // Check if projectId is a valid ObjectId
    if (!isValidObjectId(projectId)) {
      // For development, return mock project data with accepted bid
      const mockProject = {
        _id: projectId,
        title: 'Sample Project',
        description: 'This is a sample project for development purposes.',
        budget: 1500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'Web Development',
        skills: ['React', 'Node.js', 'MongoDB'],
        status: 'in-progress',
        createdAt: new Date(),
        client: {
          _id: req.user.userId || 'client123',
          username: 'ClientUser',
          email: 'client@example.com',
          profile: { avatar: 'https://via.placeholder.com/150' }
        },
        freelancer: {
          _id: 'freelancer123',
          username: 'FreelancerUser',
          email: 'freelancer@example.com',
          profile: { avatar: 'https://via.placeholder.com/150' }
        },
        bids: [
          {
            _id: bidId || 'bid1',
            freelancer: {
              _id: 'freelancer123',
              username: 'FreelancerUser',
              email: 'freelancer@example.com',
              profile: { avatar: 'https://via.placeholder.com/150' }
            },
            amount: 1200,
            deliveryTime: 14,
            proposal: 'I can deliver this project with high quality.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'accepted'
          }
        ]
      };
      
      return res.json(mockProject);
    }
    
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bid = project.bids.id(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    bid.status = 'accepted';
    project.status = 'in-progress';
    project.freelancer = bid.freelancer;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

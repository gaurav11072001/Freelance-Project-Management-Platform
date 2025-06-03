const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// @route   POST /api/chat/conversations
// @desc    Get or create a conversation
// @access  Private
router.post('/conversations',
  auth,
  chatController.getOrCreateConversation
);

// @route   GET /api/chat/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations',
  auth,
  chatController.getUserConversations
);

// @route   GET /api/chat/conversations/:conversationId/messages
// @desc    Get conversation messages
// @access  Private
router.get('/conversations/:conversationId/messages',
  auth,
  chatController.getConversationMessages
);

// @route   POST /api/chat/messages
// @desc    Send a message
// @access  Private
router.post('/messages',
  auth,
  chatController.sendMessage
);

// @route   POST /api/chat/conversations/:conversationId/read
// @desc    Mark conversation messages as read
// @access  Private
router.post('/conversations/:conversationId/read',
  auth,
  chatController.markAsRead
);

module.exports = router;

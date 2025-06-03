const { Message, Conversation } = require('../models/Message');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Helper function to check if string is valid ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get or create conversation
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { participantId, projectId } = req.body;
    
    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { 
        $all: [req.user.userId, participantId]
      },
      project: projectId
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.userId, participantId],
        project: projectId
      });
      await conversation.save();
    }

    await conversation.populate('participants', 'username email profile');
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user conversations
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.userId
    })
      .populate('participants', 'username email profile')
      .populate('project', 'title')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get conversation messages
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Check if conversationId is a valid ObjectId
    if (!isValidObjectId(conversationId)) {
      // For development, return mock data instead of error
      return res.json([
        {
          _id: 'mock1',
          conversation: conversationId,
          sender: {
            _id: 'user1',
            username: 'JohnDoe',
            email: 'john@example.com',
            profile: { avatar: 'https://via.placeholder.com/150' }
          },
          content: 'Hi, I\'m interested in your project.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          _id: 'mock2',
          conversation: conversationId,
          sender: {
            _id: req.user.userId,
            username: 'CurrentUser',
            email: 'current@example.com',
            profile: { avatar: 'https://via.placeholder.com/150' }
          },
          content: 'Thanks for reaching out! What skills do you have?',
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
        },
        {
          _id: 'mock3',
          conversation: conversationId,
          sender: {
            _id: 'user1',
            username: 'JohnDoe',
            email: 'john@example.com',
            profile: { avatar: 'https://via.placeholder.com/150' }
          },
          content: 'I have experience with React, Node.js, and MongoDB. I\'ve been working as a full-stack developer for 5 years.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]);
    }
    
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'username email profile')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, attachments } = req.body;
    
    // Check if conversationId is a valid ObjectId
    if (!isValidObjectId(conversationId)) {
      // For development, return mock message instead of error
      const mockMessage = {
        _id: 'mock_' + Date.now(),
        conversation: conversationId,
        sender: {
          _id: req.user.userId,
          username: 'CurrentUser',
          email: 'current@example.com',
          profile: { avatar: 'https://via.placeholder.com/150' }
        },
        content,
        attachments: attachments || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Emit socket event for mock message
      req.io.to(conversationId).emit('new_message', mockMessage);
      
      return res.status(201).json(mockMessage);
    }
    
    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    if (!conversation.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }
    
    // Create and save message
    const message = new Message({
      conversation: conversationId,
      sender: req.user.userId,
      content,
      attachments: attachments || []
    });
    await message.save();
    
    // Update conversation with last message and update unread counts
    conversation.lastMessage = message._id;
    conversation.unreadCounts = conversation.participants
      .filter(p => p.toString() !== req.user.userId)
      .map(p => ({
        user: p,
        count: (conversation.unreadCounts.find(uc => 
          uc.user.toString() === p.toString())?.count || 0) + 1
      }));
    await conversation.save();
    
    // Populate sender info before sending response
    await message.populate('sender', 'username email profile');
    
    // Emit socket event to conversation room
    req.io.to(conversationId).emit('new_message', message);
    
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Check if conversationId is a valid ObjectId
    if (!isValidObjectId(conversationId)) {
      // For development, just return success
      return res.json({ success: true });
    }
    
    // Update conversation unread count for current user
    await Conversation.findByIdAndUpdate(
      conversationId,
      { 
        $set: { 
          'unreadCounts.$[elem].count': 0 
        } 
      },
      { 
        arrayFilters: [{ 'elem.user': req.user.userId }],
        new: true
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

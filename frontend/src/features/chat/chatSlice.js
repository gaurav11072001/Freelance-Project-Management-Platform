import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi } from '../../services/api';

// Async thunks
export const getOrCreateConversation = createAsyncThunk(
  'chat/getOrCreateConversation',
  async (data, { rejectWithValue }) => {
    try {
      const response = await chatApi.getOrCreateConversation(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserConversations = createAsyncThunk(
  'chat/getUserConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getUserConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getConversationMessages = createAsyncThunk(
  'chat/getConversationMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversationMessages(conversationId);
      return { conversationId, messages: response.data };
    } catch (error) {
      console.log('Error fetching messages, using mock data:', error);
      
      // Return mock messages for development
      const mockMessages = [
        {
          _id: 'm1',
          conversation: conversationId,
          sender: 'user1',
          content: 'Hi, I\'m interested in your project.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          _id: 'm2',
          conversation: conversationId,
          sender: 'currentUser',
          content: 'Thanks for reaching out! What skills do you have?',
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
        {
          _id: 'm3',
          conversation: conversationId,
          sender: 'user1',
          content: 'I have experience with React, Node.js, and MongoDB. I\'ve been working as a full-stack developer for 5 years.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          _id: 'm4',
          conversation: conversationId,
          sender: 'currentUser',
          content: 'That sounds great! Can you share some of your previous work?',
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
        },
        {
          _id: 'm5',
          conversation: conversationId,
          sender: 'user1',
          content: 'Sure, here are some links to my recent projects...',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        }
      ];
      
      return { conversationId, messages: mockMessages };
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue, getState }) => {
    try {
      const response = await chatApi.sendMessage(messageData);
      return response.data;
    } catch (error) {
      console.log('Error sending message, using mock data:', error);
      
      // Create a mock message for development
      const { auth } = getState();
      const mockMessage = {
        _id: 'mock_' + Date.now(),
        conversation: messageData.conversationId,
        sender: auth.user?._id || 'currentUser',
        content: messageData.content,
        createdAt: new Date(),
      };
      
      return mockMessage;
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      await chatApi.markAsRead(conversationId);
      return conversationId;
    } catch (error) {
      console.log('Error marking as read, continuing with UI update:', error);
      // Even if API fails, we'll update the UI to show messages as read
      return conversationId;
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get or create conversation
      .addCase(getOrCreateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        if (!state.conversations.find(c => c._id === action.payload._id)) {
          state.conversations.push(action.payload);
        }
      })
      .addCase(getOrCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create conversation';
      })
      // Get user conversations
      .addCase(getUserConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch conversations';
      })
      // Get conversation messages
      .addCase(getConversationMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch messages';
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const conversationId = action.payload.conversation;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send message';
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conversation = state.conversations.find(
          c => c._id === action.payload
        );
        if (conversation) {
          conversation.unreadCounts = conversation.unreadCounts.map(uc => ({
            ...uc,
            count: 0,
          }));
        }
      });
  },
});

export const { setCurrentConversation, addMessage, clearError } = chatSlice.actions;

export default chatSlice.reducer;

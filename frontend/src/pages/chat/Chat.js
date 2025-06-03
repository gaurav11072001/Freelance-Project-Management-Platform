import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { 
  getUserConversations, 
  getConversationMessages, 
  sendMessage, 
  markAsRead 
} from '../../features/chat/chatSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
// NoData component not used in this file
import useSocket from '../../hooks/useSocket';

const Chat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages, loading } = useSelector((state) => state.chat);
  
  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [hoveredConversation, setHoveredConversation] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const { socket } = useSocket();
  
  // Get the 'with' query parameter if it exists
  const searchParams = new URLSearchParams(location.search);
  const withUserId = searchParams.get('with');

  // Socket.io connection - already defined above

  useEffect(() => {
    // Load conversations
    dispatch(getUserConversations());
  }, [dispatch]);

  useEffect(() => {
    // If withUserId is provided, find or create that conversation
    if (withUserId && conversations.length > 0) {
      const conversation = conversations.find(
        conv => conv.participants.some(p => p._id === withUserId)
      );
      
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [withUserId, conversations]);

  useEffect(() => {
    // When a conversation is selected, load its messages
    if (selectedConversation) {
      // Load messages - our Redux slice will handle errors and provide mock data
      dispatch(getConversationMessages(selectedConversation._id));
      
      // Mark messages as read - our Redux slice will handle errors
      if (selectedConversation.unreadCount > 0) {
        dispatch(markAsRead(selectedConversation._id));
      }
    }
  }, [selectedConversation, dispatch]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('new_message', (message) => {
        // If the message belongs to the current conversation, update messages
        if (message.conversation === selectedConversation?._id) {
          dispatch(getConversationMessages(selectedConversation._id));
          dispatch(markAsRead(selectedConversation._id));
        } else {
          // Otherwise, refresh the conversation list to update unread counts
          dispatch(getUserConversations());
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, selectedConversation, dispatch]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageText.trim() && selectedConversation) {
      // Send message - our Redux slice will handle errors and provide mock data
      dispatch(sendMessage({
        conversationId: selectedConversation._id,
        content: messageText,
      }));
      
      setMessageText('');
    }
  };

  // Mock data for demonstration
  const mockConversations = [
    {
      _id: '1',
      participants: [
        { _id: 'user1', username: 'John Doe', avatar: '' },
        { _id: user?._id || 'currentUser', username: user?.username || 'Current User', avatar: '' }
      ],
      lastMessage: {
        content: 'Hi, I need a website for my business',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        sender: 'user1'
      },
      unreadCount: 2
    },
    {
      _id: '2',
      participants: [
        { _id: 'user2', username: 'Jane Smith', avatar: '' },
        { _id: user?._id || 'currentUser', username: user?.username || 'Current User', avatar: '' }
      ],
      lastMessage: {
        content: 'When can you start the project?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        sender: user?._id || 'currentUser'
      },
      unreadCount: 0
    }
  ];

  const mockMessages = [
    {
      _id: 'm1',
      conversation: '1',
      sender: 'user1',
      content: "Hi, I'm interested in your project.",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      _id: 'm2',
      conversation: '1',
      sender: user?._id || 'currentUser',
      content: 'Thanks for reaching out! What kind of project do you have in mind?',
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
    {
      _id: 'm3',
      conversation: '1',
      sender: 'user1',
      content: 'I need a website for my small business. Something modern and clean.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      _id: 'm4',
      conversation: '1',
      sender: user?._id || 'currentUser',
      content: "I can definitely help with that. What's your budget and timeline?",
      createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
    }
  ];

  // Use real data if available, otherwise use mock data
  const displayConversations = conversations.length > 0 ? conversations : mockConversations;
  
  // Messages to display - Redux state now handles mock data fallback
  const messagesToDisplay = selectedConversation && messages[selectedConversation._id] ? 
    messages[selectedConversation._id] : 
    (selectedConversation?._id === '1' ? mockMessages : []);

  const getOtherParticipant = (conversation) => {
    return conversation?.participants?.find(p => p._id !== user?._id) || {};
  };

  if (loading && !displayConversations.length) {
    return <LoadingSpinner message="Loading conversations..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 80px)', py: 3 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Conversations */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper 
            elevation={0}
            sx={{ 
              height: '100%', 
              overflow: 'hidden',
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}
          >
            <Box 
              sx={{ 
                p: 3, 
                borderBottom: '1px solid #F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500, 
                  color: '#000000',
                  fontSize: '1.1rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Conversations
              </Typography>
            </Box>
            <List 
              sx={{ 
                height: 'calc(100% - 70px)', 
                overflow: 'auto',
                p: 1.5,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                },
              }}
            >
              {displayConversations.length > 0 ? (
                displayConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  const lastMessage = conversation.lastMessage;
                  const unreadCount = conversation.unreadCount || 0;
                  const isSelected = selectedConversation?._id === conversation._id;
                  // eslint-disable-next-line no-unused-vars
                  const isHovered = hoveredConversation === conversation._id;

                  return (
                    <ListItem
                      key={conversation._id}
                      disablePadding
                      onMouseEnter={() => setHoveredConversation(conversation._id)}
                      onMouseLeave={() => setHoveredConversation(null)}
                      sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        borderRadius: 2,
                        bgcolor: isSelected ? 'rgba(56, 64, 222, 0.06)' : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: isSelected ? 'rgba(56, 64, 222, 0.08)' : 'rgba(0,0,0,0.02)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleSelectConversation(conversation)}
                        sx={{ 
                          p: 2,
                          borderRadius: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={otherParticipant?.avatar}
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: 'rgba(56, 64, 222, 0.1)',
                              color: '#3840DE',
                              border: '1px solid rgba(56, 64, 222, 0.2)',
                              fontSize: '1rem',
                              fontWeight: 500,
                            }}
                          >
                            {otherParticipant?.username?.[0]?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={otherParticipant?.username}
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                  maxWidth: '140px',
                                  color: unreadCount > 0 ? '#000000' : '#666666',
                                  fontWeight: unreadCount > 0 ? 500 : 400,
                                  fontSize: '0.875rem',
                                }}
                              >
                                {lastMessage
                                  ? `${lastMessage.sender === user?._id ? 'You: ' : ''}${lastMessage.content}`
                                  : 'No messages yet'}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#666666',
                                  fontSize: '0.75rem',
                                  ml: 1,
                                  flexShrink: 0,
                                }}
                              >
                                {lastMessage && lastMessage.createdAt && 
                                  (() => {
                                    try {
                                      const date = new Date(lastMessage.createdAt);
                                      return isNaN(date.getTime()) ? '' : format(date, 'MMM d');
                                    } catch (e) {
                                      return '';
                                    }
                                  })()
                                }
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: unreadCount > 0 ? 600 : 500,
                              color: '#000000',
                              fontSize: '0.9375rem',
                              mb: 0.5,
                            }
                          }}
                          secondaryTypographyProps={{
                            component: 'div',
                          }}
                        />
                        {unreadCount > 0 && (
                          <Box
                            sx={{
                              minWidth: 24,
                              height: 24,
                              borderRadius: 12,
                              bgcolor: '#3840DE',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              ml: 1,
                              boxShadow: '0 2px 8px rgba(56, 64, 222, 0.25)',
                            }}
                          >
                            {unreadCount}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                  }}
                >
                  <Typography 
                    color="text.secondary"
                    sx={{ 
                      textAlign: 'center',
                      fontSize: '0.9375rem',
                      color: '#666666',
                      fontStyle: 'italic',
                    }}
                  >
                    No conversations yet
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Messages */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            elevation={0}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 3,
              border: '1px solid #F0F0F0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            }}
          >
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <Box 
                  sx={{ 
                    p: 3, 
                    borderBottom: '1px solid #F5F5F5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={getOtherParticipant(selectedConversation)?.avatar}
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'rgba(56, 64, 222, 0.1)',
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: '1rem',
                        border: '1px solid rgba(56, 64, 222, 0.2)',
                        mr: 2,
                      }}
                    >
                      {getOtherParticipant(selectedConversation)?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 500, 
                          color: '#000000',
                          fontSize: '1.1rem',
                          letterSpacing: '-0.01em',
                          mb: 0.5,
                        }}
                      >
                        {getOtherParticipant(selectedConversation)?.username}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedConversation.project ? 'Project Discussion' : 'Direct Message'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Messages List */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    p: 3, 
                    bgcolor: '#FAFAFA',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: '10px',
                    },
                  }}
                >
                  {messagesToDisplay.length === 0 ? (
                    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography 
                        color="text.secondary" 
                        sx={{ 
                          fontStyle: 'italic', 
                          textAlign: 'center',
                          fontSize: '0.9375rem',
                          color: '#666666'
                        }}
                      >
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {messagesToDisplay.map((message, index) => {
                        const isCurrentUser = message.sender === user?._id || message.sender._id === user?._id;
                        // Safely create and format dates with validation
                        const safeFormatDate = (date, formatString) => {
                          try {
                            const dateObj = new Date(date);
                            return isNaN(dateObj.getTime()) ? '' : format(dateObj, formatString);
                          } catch (e) {
                            console.error('Date formatting error:', e);
                            return '';
                          }
                        };
                        
                        const messageDate = new Date(message.createdAt);
                        const messageTime = safeFormatDate(messageDate, 'h:mm a');
                        const messageDay = safeFormatDate(messageDate, 'MMM dd, yyyy');
                        
                        // Check if we should show a date divider with safe date formatting
                        const showDateDivider = index === 0 || (
                          messagesToDisplay[index - 1]?.createdAt && 
                          safeFormatDate(new Date(messagesToDisplay[index - 1].createdAt), 'yyyy-MM-dd') !== 
                          safeFormatDate(messageDate, 'yyyy-MM-dd')
                        );
                        
                        return (
                          <React.Fragment key={message._id}>
                            {showDateDivider && (
                              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    bgcolor: 'rgba(56, 64, 222, 0.06)', 
                                    color: '#3840DE',
                                    px: 2.5, 
                                    py: 0.75, 
                                    borderRadius: 20,
                                    fontWeight: 500,
                                    fontSize: '0.8125rem',
                                    letterSpacing: '0.02em'
                                  }}
                                >
                                  {messageDay}
                                </Typography>
                              </Box>
                            )}
                            
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                width: '100%',
                                mb: 0.5,
                              }}
                            >
                              {/* Avatar for receiver messages */}
                              {!isCurrentUser && (
                                <Tooltip title={getOtherParticipant(selectedConversation).username} placement="left" arrow>
                                  <Avatar 
                                    src={getOtherParticipant(selectedConversation)?.avatar}
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      mr: 1.5,
                                      bgcolor: 'rgba(56, 64, 222, 0.1)',
                                      color: '#3840DE',
                                      border: '1px solid rgba(56, 64, 222, 0.2)',
                                      fontSize: '0.9375rem',
                                      fontWeight: 500
                                    }}
                                  >
                                    {getOtherParticipant(selectedConversation)?.username?.[0]?.toUpperCase()}
                                  </Avatar>
                                </Tooltip>
                              )}

                              <Box
                                sx={{
                                  maxWidth: '65%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                                }}
                              >
                                <Box
                                  sx={{
                                    bgcolor: isCurrentUser ? '#3840DE' : '#FFFFFF',
                                    color: isCurrentUser ? '#FFFFFF' : '#000000',
                                    p: 2,
                                    borderRadius: 3,
                                    boxShadow: isCurrentUser 
                                      ? '0 4px 12px rgba(56, 64, 222, 0.25)'
                                      : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    border: isCurrentUser ? 'none' : '1px solid #F0F0F0',
                                    position: 'relative',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'translateY(-1px)',
                                      boxShadow: isCurrentUser 
                                        ? '0 6px 16px rgba(56, 64, 222, 0.3)'
                                        : '0 6px 16px rgba(0, 0, 0, 0.12)',
                                    }
                                  }}
                                >
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      whiteSpace: 'pre-wrap', 
                                      wordBreak: 'break-word',
                                      fontSize: '0.9375rem',
                                      lineHeight: 1.5,
                                      letterSpacing: '0.01em'
                                    }}
                                  >
                                    {message.content}
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.secondary',
                                    mt: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                  }}
                                >
                                  {messageTime}
                                </Typography>
                              </Box>

                              {/* Avatar for sender messages */}
                              {isCurrentUser && (
                                <Tooltip title="You" placement="right" arrow>
                                  <Avatar
                                    src={user?.avatar}
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      ml: 1.5,
                                      bgcolor: 'rgba(56, 64, 222, 0.1)',
                                      color: '#3840DE',
                                      border: '1px solid rgba(56, 64, 222, 0.2)',
                                      fontSize: '0.9375rem',
                                      fontWeight: 500
                                    }}
                                  >
                                    {user?.username?.[0]?.toUpperCase()}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </Box>
                  )}
                </Box>

                {/* Message Input */}
                <Box 
                  sx={{ 
                    p: 3, 
                    borderTop: '1px solid #F5F5F5', 
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 -10px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <form onSubmit={handleSendMessage}>
                    <TextField
                      fullWidth
                      placeholder="Write a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      multiline
                      maxRows={4}
                      variant="outlined"
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: '#FAFAFA',
                          border: '1px solid #F0F0F0',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E0E0E0',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#FFFFFF',
                            borderColor: '#3840DE',
                            boxShadow: '0 0 0 3px rgba(56, 64, 222, 0.12)',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          fontSize: '0.9375rem',
                          lineHeight: 1.5,
                          padding: '12px 16px',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              size="medium"
                              sx={{
                                color: 'text.secondary',
                                '&:hover': {
                                  color: 'primary.main',
                                  backgroundColor: 'rgba(56, 64, 222, 0.08)',
                                },
                              }}
                            >
                              <AttachFileIcon sx={{ fontSize: '1.25rem' }} />
                            </IconButton>
                            <IconButton
                              color="primary"
                              type="submit"
                              disabled={!messageText.trim()}
                              size="medium"
                              sx={{
                                ml: 1,
                                bgcolor: messageText.trim() ? '#3840DE' : '#E0E0E0',
                                color: '#FFFFFF',
                                width: 40,
                                height: 40,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: messageText.trim() ? '#2930B8' : '#BDBDBD',
                                  transform: 'translateY(-1px)',
                                  boxShadow: messageText.trim() 
                                    ? '0 4px 12px rgba(56, 64, 222, 0.25)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                                },
                              }}
                            >
                              <SendIcon sx={{ fontSize: '1.25rem' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </form>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500, 
                      color: '#000000',
                      fontSize: '1.1rem',
                      mb: 1,
                    }}
                  >
                    Select a conversation
                  </Typography>
                  <Typography 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.9375rem',
                      color: '#666666',
                    }}
                  >
                    Choose a conversation from the list to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;

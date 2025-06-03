import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../features/chat/chatSlice';

// Use the correct backend URL - match it with your actual backend server
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create a mock socket for development if real socket fails
const createMockSocket = () => {
  const mockSocket = {
    on: (event, callback) => {
      console.log(`Mock socket registered event: ${event}`);
      return mockSocket;
    },
    off: (event) => {
      console.log(`Mock socket unregistered event: ${event}`);
      return mockSocket;
    },
    emit: (event, data) => {
      console.log(`Mock socket emitted event: ${event}`, data);
      return mockSocket;
    },
    disconnect: () => {
      console.log('Mock socket disconnected');
    }
  };
  return mockSocket;
};

export const useSocket = () => {
  const socketRef = useRef();
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only initialize socket if user is logged in
    if (user && user.token) {
      try {
        // Initialize socket connection with auth token
        socketRef.current = io(SOCKET_URL, {
          auth: {
            token: user.token
          },
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling']
        });

        // Handle connection errors
        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
          // If connection fails, use mock socket for development
          if (!socketRef.current.connected) {
            console.log('Using mock socket for development');
            socketRef.current = createMockSocket();
          }
        });

        // Handle incoming messages
        socketRef.current.on('new_message', (message) => {
          dispatch(addMessage({
            conversationId: message.conversation,
            message
          }));
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
        // Use mock socket if real socket fails
        socketRef.current = createMockSocket();
      }
    } else {
      // Use mock socket for development if user is not logged in
      socketRef.current = createMockSocket();
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (socketRef.current && currentConversation) {
      // Leave previous conversation room if any
      if (socketRef.current.previousRoom) {
        socketRef.current.emit('leave_conversation', socketRef.current.previousRoom);
      }

      // Join new conversation room
      socketRef.current.emit('join_conversation', currentConversation._id);
      socketRef.current.previousRoom = currentConversation._id;
    }
  }, [currentConversation]);

  const sendMessage = (content, attachments = []) => {
    if (!currentConversation || !user) return;

    const messageData = {
      conversationId: currentConversation._id,
      content,
      attachments
    };

    // Emit message event if socket is connected
    if (socketRef.current) {
      socketRef.current.emit('send_message', messageData);
    }

    return messageData;
  };

  return {
    socket: socketRef.current,
    sendMessage
  };
};

export default useSocket;

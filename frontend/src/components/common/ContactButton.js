import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { ChatBubbleOutline as MessageIcon } from '@mui/icons-material';
import { getOrCreateConversation } from '../../features/chat/chatSlice';

/**
 * A reusable button component that initiates a conversation with another user
 * 
 * @param {Object} props
 * @param {string} props.userId - The ID of the user to contact
 * @param {string} [props.variant='contained'] - Button variant
 * @param {string} [props.size='medium'] - Button size
 * @param {string} [props.buttonText='Contact'] - Button text
 * @param {Object} [props.sx] - Additional MUI styling
 */
const ContactButton = ({ 
  userId, 
  variant = 'contained', 
  size = 'medium', 
  buttonText = 'Contact',
  sx = {},
  ...props 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContact = async () => {
    try {
      // Create or get existing conversation with this user
      const resultAction = await dispatch(getOrCreateConversation({ 
        participantId: userId 
      }));
      
      if (getOrCreateConversation.fulfilled.match(resultAction)) {
        // Navigate to chat with this conversation selected
        navigate(`/chat?with=${userId}`);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={<MessageIcon />}
      onClick={handleContact}
      sx={{ ...sx }}
      {...props}
    >
      {buttonText}
    </Button>
  );
};

export default ContactButton;

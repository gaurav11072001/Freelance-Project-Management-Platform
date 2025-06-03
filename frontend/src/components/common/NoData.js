import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NoData = ({
  title = 'No Data Found',
  message = 'There are no items to display.',
  actionText,
  actionPath,
  onActionClick,
  icon: Icon,
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: 64,
            color: 'text.secondary',
            mb: 2,
          }}
        />
      )}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {message}
      </Typography>
      {actionText && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAction}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default NoData;

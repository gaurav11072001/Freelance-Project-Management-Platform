import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
  title,
  subtitle,
  actionText,
  actionIcon: ActionIcon,
  actionPath,
  onActionClick,
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
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {(actionText || ActionIcon) && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAction}
          startIcon={ActionIcon && <ActionIcon />}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;

import React from 'react';
import { useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MonetizationOn as BidIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const NotificationList = () => {
  const { notifications } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    (notification) => notification.userId === user?.userId || notification.userId === user?._id
  );

  if (!userNotifications.length) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">No notifications</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {userNotifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              bgcolor: notification.read ? 'transparent' : 'action.hover',
            }}
          >
            <ListItemIcon>
              {notification.type === 'bid_received' ? (
                <Badge color="primary" variant="dot">
                  <BidIcon color="primary" />
                </Badge>
              ) : (
                <NotificationsIcon />
              )}
            </ListItemIcon>
            <ListItemText
              primary={notification.message}
              secondary={format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationList;

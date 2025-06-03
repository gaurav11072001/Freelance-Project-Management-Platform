import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to send notification
export const sendNotification = createAsyncThunk(
  'notifications/sendNotification',
  async ({ userId, message, type }, { rejectWithValue }) => {
    try {
      // In a real app, this would make an API call to save the notification
      // For now, we'll just return a mock response
      const notification = {
        id: Date.now().toString(),
        userId,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
      };
      return notification;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  notifications: [],
  loading: false,
  error: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications.unshift(action.payload);
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send notification';
      });
  }
});

export const { clearNotifications, markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;

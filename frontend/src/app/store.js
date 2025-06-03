import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import chatReducer from '../features/chat/chatSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import paymentReducer from '../features/payments/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    payments: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import tasksReducer from './tasksSlice.js';
import notificationsReducer from './notificationsSlice.js';
import uiReducer from './uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredPaths: ['tasks.entities'],
      },
    }),
});

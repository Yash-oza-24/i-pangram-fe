import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    open: false,
  },
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markRead(state, action) {
      const item = state.items.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.items.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    togglePanel(state) {
      state.open = !state.open;
    },
    setPanelOpen(state, action) {
      state.open = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markRead,
  markAllRead,
  togglePanel,
  setPanelOpen,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

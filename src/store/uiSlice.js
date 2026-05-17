import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('theme');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: stored === 'dark' || stored === 'light' ? stored : 'light',
    sidebarOpen: false,
    showCompleted: false,
    showActivity: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    initTheme(state) {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setShowCompleted(state, action) {
      state.showCompleted = action.payload;
    },
    setShowActivity(state, action) {
      state.showActivity = action.payload;
    },
  },
});

export const { toggleTheme, initTheme, toggleSidebar, setShowCompleted, setShowActivity } =
  uiSlice.actions;
export default uiSlice.reducer;

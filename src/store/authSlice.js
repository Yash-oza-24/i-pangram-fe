import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');

const initialState = {
  user: null,
  token: token || null,
  status: token ? 'loading' : 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';
      localStorage.setItem('token', action.payload.token);
    },
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setAuthStatus } = authSlice.actions;
export default authSlice.reducer;

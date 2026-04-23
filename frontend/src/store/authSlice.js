import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

let parsedUser = null;

try {
  parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch {
  localStorage.removeItem('user');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,
    token: storedToken || null,
    isAuthenticated: Boolean(storedToken && parsedUser),
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Permission, Role, User } from '../../types/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from '../../config/permissions';
import axios from 'axios';

// Async thunks
// Async thunk for logout
export const logout = () => async (dispatch: any) => {
  dispatch(logoutStart());
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/user/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Important for handling cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Logout failed');
    }

    dispatch(logoutSuccess());
    return true;
  } catch (err) {
    console.error('Logout error:', err);
    dispatch(logoutFailure('Logout failed. Please try again.'));
    return false;
  }
};


interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Check for existing session and token on initialization
const savedUser = localStorage.getItem('admin_user');
const savedToken = localStorage.getItem('token');

if (savedUser && savedToken) {
  try {
    initialState.user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('token');
  }
} else {
  // Clear stored data if either user or token is missing
  localStorage.removeItem('admin_user');
  localStorage.removeItem('token');
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{user: User; token: string}>) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      localStorage.setItem('admin_user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('admin_user');
      localStorage.removeItem('token');
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserPermissions: (state, action: PayloadAction<{ userId: string; permissions: Permission[] }>) => {
      if (state.user && state.user.id === action.payload.userId) {
        state.user.permissions = action.payload.permissions;
        localStorage.setItem('admin_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutStart, logoutSuccess, logoutFailure, clearError, updateUserPermissions } = authSlice.actions;

// Async thunk for login
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  dispatch(loginStart());
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
      credentials: 'include' // Important for handling cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    console.log("setUserData",data.result)
    dispatch(loginSuccess({
      user: data.result,
      token: data.token
    }));
    return true;
  } catch (err) {
    console.error('Login error:', err);
    dispatch(loginFailure('Login failed. Please try again.'));
    return false;
  }
};

export default authSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permission, Role, User } from '../../types/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from '../../config/permissions';

// Mock users for demo - replace with your backend API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'super@admin.com',
    role: 'super_admin',
    permissions: DEFAULT_ROLE_PERMISSIONS.super_admin
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@admin.com',
    role: 'admin',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
    societyId: '1',
    societyName: 'Green Valley Apartments'
  }
];

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

// Check for existing session on initialization
const savedUser = localStorage.getItem('admin_user');
if (savedUser) {
  try {
    initialState.user = JSON.parse(savedUser);
  } catch (error) {
    localStorage.removeItem('admin_user');
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('admin_user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('admin_user');
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

export const { loginStart, loginSuccess, loginFailure, logout, clearError, updateUserPermissions } = authSlice.actions;

// Async thunk for login
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  console.log('Login attempt:', { email, password });
  dispatch(loginStart());
  
  try {
    // Mock authentication - replace with your backend API
    console.log('Available users:', mockUsers);
    const foundUser = mockUsers.find(u => u.email === email);
    console.log('Found user:', foundUser);
    console.log('Password check:', password, '===', 'admin123', password === 'admin123');
    
    if (foundUser && password === 'admin123') {
      console.log('Login successful for user:', foundUser);
      dispatch(loginSuccess(foundUser));
      return true;
    }
    console.log('Login failed - invalid credentials');
    dispatch(loginFailure('Invalid email or password'));
    return false;
  } catch (err) {
    console.error('Login error:', err);
    dispatch(loginFailure('Login failed. Please try again.'));
    return false;
  }
};

export default authSlice.reducer;

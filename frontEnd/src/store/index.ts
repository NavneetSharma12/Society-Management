import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import societyReducer from './slices/societySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    society: societyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
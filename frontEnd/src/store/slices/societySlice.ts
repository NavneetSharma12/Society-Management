import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Society } from '../../types/society';

interface SocietyState {
  societies: Society[];
  loading: boolean;
  error: string | null;
}

const initialState: SocietyState = {
  societies: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSocieties = createAsyncThunk(
  'society/fetchSocieties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/society');
      return response?.data?.result || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch societies');
    }
  }
);

export const createSociety = createAsyncThunk(
  'society/createSociety',
  async (societyData: Partial<Society>, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/society', societyData);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create society');
    }
  }
);

const societySlice = createSlice({
  name: 'society',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch societies
    builder
      .addCase(fetchSocieties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocieties.fulfilled, (state, action: PayloadAction<Society[]>) => {
        state.societies = action.payload;
        state.loading = false;
      })
      .addCase(fetchSocieties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Create society
    builder
      .addCase(createSociety.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSociety.fulfilled, (state, action: PayloadAction<Society>) => {
        state.societies.push(action.payload);
        state.loading = false;
      })
      .addCase(createSociety.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = societySlice.actions;
export default societySlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentApi from '../../services/paymentApi';

// Async thunks
export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createPaymentIntent(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const processPayment = createAsyncThunk(
  'payments/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentApi.processPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getPaymentHistory = createAsyncThunk(
  'payments/getPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentApi.getPaymentHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const releasePayment = createAsyncThunk(
  'payments/releasePayment',
  async ({ projectId, bidId }, { rejectWithValue }) => {
    try {
      const response = await paymentApi.releasePayment(projectId, bidId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  paymentIntent: null,
  paymentHistory: [],
  currentPayment: null,
  paymentSuccess: false,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.paymentIntent = null;
      state.error = null;
      state.paymentSuccess = false;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create payment intent';
      })
      
      // Process payment
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentSuccess = false;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
        state.paymentSuccess = true;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Payment processing failed';
        state.paymentSuccess = false;
      })
      
      // Get payment history
      .addCase(getPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(getPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payment history';
      })
      
      // Release payment
      .addCase(releasePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(releasePayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update payment in history if it exists
        const index = state.paymentHistory.findIndex(p => p.projectId === action.payload.projectId);
        if (index !== -1) {
          state.paymentHistory[index] = action.payload;
        }
      })
      .addCase(releasePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to release payment';
      });
  },
});

export const { clearPaymentState, clearPaymentError } = paymentSlice.actions;

export default paymentSlice.reducer;

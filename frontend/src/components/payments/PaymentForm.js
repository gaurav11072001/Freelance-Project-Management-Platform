import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { createPaymentIntent, processPayment, clearPaymentState } from '../../features/payments/paymentSlice';

const PaymentForm = ({ projectId, bidId, amount, onPaymentSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { loading, error, paymentSuccess, paymentIntent } = useSelector((state) => state.payments);
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Create payment intent when component mounts
    dispatch(createPaymentIntent({ projectId, bidId, amount }));
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearPaymentState());
    };
  }, [dispatch, projectId, bidId, amount]);

  useEffect(() => {
    // Handle successful payment
    if (paymentSuccess) {
      onPaymentSuccess();
    }
  }, [paymentSuccess, onPaymentSuccess]);

  const validateForm = () => {
    const errors = {};
    
    if (!cardDetails.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Invalid card number';
    }
    
    if (!cardDetails.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      errors.expiryDate = 'Invalid format (MM/YY)';
    }
    
    if (!cardDetails.cvc.trim()) {
      errors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
      errors.cvc = 'Invalid CVC';
    }
    
    if (!cardDetails.name.trim()) {
      errors.name = 'Cardholder name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Process the payment
    dispatch(processPayment({
      projectId,
      bidId,
      amount,
      paymentMethodId: 'pm_card_visa', // In a real app, this would come from Stripe
      paymentIntentId: paymentIntent?.id,
      cardDetails: {
        // Only send this in development, in production we'd use Stripe Elements
        // and would never send raw card details to our server
        last4: cardDetails.cardNumber.slice(-4),
        brand: 'visa',
        expMonth: cardDetails.expiryDate.split('/')[0],
        expYear: cardDetails.expiryDate.split('/')[1],
      }
    }));
  };

  return (
    <Card>
      <CardHeader 
        title="Secure Payment" 
        subheader="Your payment will be held in escrow until the project is completed"
      />
      <Divider />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Project Bid Amount:</Typography>
                <Typography variant="body1" fontWeight="bold">${amount}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Platform Fee (5%):</Typography>
                <Typography variant="body1">${(amount * 0.05).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">${(amount * 1.05).toFixed(2)}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Card Details
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.name}>
                <TextField
                  label="Cardholder Name"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleChange}
                  fullWidth
                  error={!!formErrors.name}
                />
                {formErrors.name && <FormHelperText>{formErrors.name}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.cardNumber}>
                <TextField
                  label="Card Number"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  fullWidth
                  error={!!formErrors.cardNumber}
                />
                {formErrors.cardNumber && <FormHelperText>{formErrors.cardNumber}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth error={!!formErrors.expiryDate}>
                <TextField
                  label="Expiry Date"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  fullWidth
                  error={!!formErrors.expiryDate}
                />
                {formErrors.expiryDate && <FormHelperText>{formErrors.expiryDate}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth error={!!formErrors.cvc}>
                <TextField
                  label="CVC"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  fullWidth
                  error={!!formErrors.cvc}
                />
                {formErrors.cvc && <FormHelperText>{formErrors.cvc}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Processing...
                    </>
                  ) : (
                    `Pay $${(amount * 1.05).toFixed(2)}`
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

PaymentForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  bidId: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PaymentForm;

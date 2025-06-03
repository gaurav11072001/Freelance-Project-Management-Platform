import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Link,
  Alert,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import FormField from '../../components/common/FormField';
import { register, clearError } from '../../features/auth/authSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Please select a role'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to projects page
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...registerData } = values;
      await dispatch(register(registerData)).unwrap();
      navigate('/projects');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create an Account
        </Typography>
        
        {showError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormField
                    name="username"
                    label="Username"
                    placeholder="Choose a username"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormField
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field name="role">
                    {({ field }) => (
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">I want to:</FormLabel>
                        <RadioGroup
                          row
                          {...field}
                          value={field.value || 'client'}
                        >
                          <FormControlLabel
                            value="client"
                            control={<Radio />}
                            label="Hire for a project (Client)"
                          />
                          <FormControlLabel
                            value="freelancer"
                            control={<Radio />}
                            label="Work on projects (Freelancer)"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;

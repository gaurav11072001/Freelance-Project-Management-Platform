import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import FormField from '../common/FormField';
import { submitBid } from '../../features/projects/projectSlice';
import { sendNotification } from '../../features/notifications/notificationSlice';

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .typeError('Bid amount must be a number')
    .required('Bid amount is required')
    .positive('Amount must be positive')
    .min(1, 'Amount must be at least 1'),
  proposal: Yup.string()
    .required('Proposal is required')
    .min(10, 'Proposal must be at least 10 characters')
    .max(2000, 'Proposal must not exceed 2000 characters'),
  timeframe: Yup.number()
    .typeError('Timeframe must be a number')
    .required('Timeframe is required')
    .positive('Timeframe must be positive')
    .integer('Timeframe must be a whole number')
    .min(1, 'Timeframe must be at least 1 day'),
});

const BidForm = ({ open, onClose, projectId }) => {
  const project = useSelector((state) => state.projects.project);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const initialValues = {
    amount: '',
    proposal: '',
    timeframe: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    console.log('BidForm - handleSubmit called');
    console.log('Values:', values);
    console.log('ProjectId:', projectId);

    // Validate values
    const errors = {};
    if (!values.amount || values.amount <= 0) {
      errors.amount = 'Bid amount must be greater than 0';
    }
    if (!values.proposal || values.proposal.length < 10) {
      errors.proposal = 'Proposal must be at least 10 characters';
    }
    if (!values.timeframe || values.timeframe <= 0) {
      errors.timeframe = 'Timeframe must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      // Prepare bid data
      const bidData = {
        amount: parseFloat(values.amount),
        proposal: values.proposal.trim(),
        timeframe: parseInt(values.timeframe)
      };

      console.log('Submitting bid:', {
        projectId,
        bidData,
        token: !!localStorage.getItem('token')
      });

      // Dispatch the action
      const result = await dispatch(submitBid({ projectId, bidData })).unwrap();
      console.log('Bid submission successful:', result);

      // Send notification to project owner
      if (project?.client?._id) {
        await dispatch(sendNotification({
          userId: project.client._id,
          message: `${user.username} has submitted a proposal for your project "${project.title}"`,
          type: 'bid_received'
        }));
      }

      // Show success message and close form
      alert('Your proposal has been submitted successfully!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Bid submission failed:', error);
      const errorMessage = error?.message || 'Failed to submit proposal. Please try again.';
      
      // Show error in form and alert
      setErrors({ _error: errorMessage });
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Proposal</DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form>
            <DialogContent>
              <FormField
                name="amount"
                label="Bid Amount ($)"
                type="number"
                required
                placeholder="Enter your bid amount"
              />
              <FormField
                name="timeframe"
                label="Timeframe (days)"
                type="number"
                required
                placeholder="Enter estimated completion time in days"
              />
              <FormField
                name="proposal"
                label="Proposal"
                multiline
                rows={6}
                required
                placeholder="Write your proposal (minimum 10 characters)"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
              </Button>
            </DialogActions>
            {/* Debug info */}
            <DialogContent>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                <pre>Values: {JSON.stringify(values, null, 2)}</pre>
                <pre>Errors: {JSON.stringify(errors, null, 2)}</pre>
                <pre>ProjectId: {projectId}</pre>
              </div>
            </DialogContent>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default BidForm;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  List,
  ListItem,
  ListItemAvatar,
  // Unused imports removed
  Avatar,
  Typography,
  Button,
  Paper,
  Box,
  Chip,
  Divider,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { acceptBid } from '../../features/projects/projectSlice';
import ConfirmDialog from '../common/ConfirmDialog';
import ContactButton from '../common/ContactButton';
import PaymentForm from '../payments/PaymentForm';

const BidList = ({ projectId, bids, isOwner, projectStatus }) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const { user } = useSelector(state => state.auth);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentBid, setPaymentBid] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleAcceptBid = async () => {
    try {
      await dispatch(acceptBid({ projectId, bidId: selectedBid._id })).unwrap();
      setSelectedBid(null);
      
      // After accepting bid, show payment dialog if user is project owner
      if (isOwner) {
        setPaymentBid(selectedBid);
        setShowPaymentDialog(true);
      }
    } catch (error) {
      console.error('Failed to accept bid:', error);
    }
  };
  
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentDialog(false);
      setPaymentSuccess(false);
    }, 2000);
  };

  if (!bids?.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No bids have been submitted yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <List>
        {bids.map((bid, index) => {
          const isPaid = bid.paymentStatus === 'paid';
          const isAccepted = bid.status === 'accepted';
          const isCompleted = bid.status === 'completed';
          
          return (
            <React.Fragment key={bid._id}>
              <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
                <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {bid.freelancer.username}
                      </Typography>
                      {isAccepted && (
                        <Chip
                          label="Accepted"
                          color="success"
                          size="small"
                        />
                      )}
                      {isPaid && (
                        <Chip
                          icon={<PaymentIcon />}
                          label="Paid"
                          color="info"
                          size="small"
                        />
                      )}
                      {isCompleted && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Completed"
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <MoneyIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: 'text.secondary' }}
                          />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            ${bid.amount.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: 'text.secondary' }}
                          />
                          <Typography variant="body2">
                            {bid.timeframe} {bid.timeframe === 1 ? 'day' : 'days'}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {bid.proposal}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Submitted {bid.createdAt 
                          ? format(parseISO(bid.createdAt), 'MMM dd, yyyy')
                          : 'Recently'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', mt: 2 }}>
                  <Stack direction="row" spacing={1}>
                    {isOwner && projectStatus === 'open' && !isAccepted && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setSelectedBid(bid)}
                      >
                        Accept Bid
                      </Button>
                    )}
                    {isOwner && isAccepted && !isPaid && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<PaymentIcon />}
                        onClick={() => {
                          setPaymentBid(bid);
                          setShowPaymentDialog(true);
                        }}
                      >
                        Pay Now
                      </Button>
                    )}
                    <ContactButton
                      userId={bid.freelancer._id}
                      variant="outlined"
                      size="small"
                      buttonText="Contact"
                    />
                  </Stack>
                </Box>
              </ListItem>
              {index < bids.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>

      <ConfirmDialog
        open={!!selectedBid}
        title="Accept Bid"
        message={`Are you sure you want to accept the bid from ${selectedBid?.freelancer.username}? After accepting, you'll need to make a payment to secure the freelancer's services.`}
        onConfirm={handleAcceptBid}
        onCancel={() => setSelectedBid(null)}
        confirmText="Accept"
        severity="success"
      />
      
      <Dialog 
        open={showPaymentDialog} 
        onClose={() => !paymentSuccess && setShowPaymentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {paymentSuccess ? 'Payment Successful' : 'Make Payment'}
          {!paymentSuccess && (
            <IconButton
              aria-label="close"
              onClick={() => setShowPaymentDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          {paymentSuccess ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', width: 60, height: 60, mb: 2 }}>
                <CheckCircleIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Payment Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your payment has been processed and the funds are now in escrow.
                They will be released to the freelancer upon project completion.
              </Typography>
            </Box>
          ) : paymentBid && (
            <PaymentForm
              projectId={projectId}
              bidId={paymentBid._id}
              amount={paymentBid.amount}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={() => setShowPaymentDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

BidList.propTypes = {
  projectId: PropTypes.string.isRequired,
  bids: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      freelancer: PropTypes.shape({
        username: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
      }).isRequired,
      amount: PropTypes.number.isRequired,
      timeframe: PropTypes.number.isRequired,
      proposal: PropTypes.string.isRequired,
      status: PropTypes.string,
      paymentStatus: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  isOwner: PropTypes.bool.isRequired,
  projectStatus: PropTypes.string.isRequired,
};

export default BidList;

import api from './api';

const paymentApi = {
  /**
   * Create a payment intent for a project bid
   * @param {Object} paymentData - Payment data including projectId, bidId, and amount
   * @returns {Promise} - Promise with payment intent data
   */
  createPaymentIntent: (paymentData) => 
    api.post('/payments/create-intent', paymentData),
  
  /**
   * Process a payment for a project bid
   * @param {Object} paymentData - Payment data including projectId, bidId, paymentMethodId, and amount
   * @returns {Promise} - Promise with payment confirmation
   */
  processPayment: (paymentData) =>
    api.post('/payments/process', paymentData),
  
  /**
   * Get payment history for a user
   * @returns {Promise} - Promise with payment history
   */
  getPaymentHistory: () =>
    api.get('/payments/history'),
  
  /**
   * Get payment details for a specific payment
   * @param {String} paymentId - ID of the payment
   * @returns {Promise} - Promise with payment details
   */
  getPaymentDetails: (paymentId) =>
    api.get(`/payments/${paymentId}`),
  
  /**
   * Release payment from escrow to freelancer
   * @param {String} projectId - ID of the project
   * @param {String} bidId - ID of the accepted bid
   * @returns {Promise} - Promise with release confirmation
   */
  releasePayment: (projectId, bidId) =>
    api.post(`/payments/release/${projectId}/${bidId}`),
};

export default paymentApi;

// Test script to directly call the bid submission API
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const projectId = '683d69b2b4527fe11aac33cc'; // The project ID from your logs
const token = localStorage.getItem('token');

// Bid data matching the validation requirements
const bidData = {
  amount: 500,
  proposal: "This is a test proposal with more than 10 characters to meet validation requirements.",
  timeframe: 14
};

console.log('Starting direct bid submission test');
console.log('Project ID:', projectId);
console.log('Token available:', !!token);
console.log('Bid data:', bidData);

// Make the direct API call
axios.post(`${API_URL}/projects/${projectId}/bid`, bidData, {
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': token
  }
})
.then(response => {
  console.log('Bid submission successful!');
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Bid submission failed!');
  console.error('Error:', error.response ? error.response.data : error.message);
  
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
  }
});

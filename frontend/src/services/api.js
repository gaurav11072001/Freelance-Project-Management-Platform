import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const projectApi = {
  createProject: (projectData) => api.post('/projects', projectData),
  getProjects: (filters) => api.get('/projects', { params: filters }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (projectId, projectData) => api.put(`/projects/${projectId}`, projectData),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  submitBid: async (projectId, bidData) => {
    console.log('API Service - Submitting bid:', { projectId, bidData });
    console.log('Token available:', !!localStorage.getItem('token'));
    
    try {
      const response = await api.post(`/projects/${projectId}/bid`, bidData);
      console.log('API Service - Bid submission successful:', response.data);
      return response;
    } catch (error) {
      console.error('API Service - Bid submission failed:', error.response?.data || error.message);
      console.error('Status code:', error.response?.status);
      throw error;
    }
  },
  acceptBid: (projectId, bidId) => api.post(`/projects/${projectId}/bid/${bidId}/accept`),
};

export const chatApi = {
  getOrCreateConversation: (data) => api.post('/chat/conversations', data),
  getUserConversations: () => api.get('/chat/conversations'),
  getConversationMessages: (conversationId) => 
    api.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (messageData) => api.post('/chat/messages', messageData),
  markAsRead: (conversationId) => 
    api.post(`/chat/conversations/${conversationId}/read`),
};

export default api;

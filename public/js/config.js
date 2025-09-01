/**
 * BlueRock Asset Management - API Configuration
 */

const API_CONFIG = {
  // Base URL for API calls - will be automatically determined based on the current domain
  BASE_URL: '/api',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // User endpoints
    USER: {
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/update-profile',
      CHANGE_PASSWORD: '/users/change-password',
    },
    
    // Client endpoints
    CLIENT: {
      LIST: '/clients',
      DETAILS: '/clients/',
      CREATE: '/clients',
      UPDATE: '/clients/',
      DELETE: '/clients/',
    },
    
    // Investment endpoints
    INVESTMENT: {
      LIST: '/investments',
      DETAILS: '/investments/',
      CREATE: '/investments',
      UPDATE: '/investments/',
      DELETE: '/investments/',
    },
    
    // Transaction endpoints
    TRANSACTION: {
      LIST: '/transactions',
      DETAILS: '/transactions/',
      CREATE: '/transactions',
      UPDATE: '/transactions/',
      DELETE: '/transactions/',
    },
    
    // Withdrawal endpoints
    WITHDRAWAL: {
      LIST: '/withdrawals',
      DETAILS: '/withdrawals/',
      CREATE: '/withdrawals',
      UPDATE: '/withdrawals/',
      DELETE: '/withdrawals/',
      REQUEST_PIN: '/withdrawals/request-pin',
      VERIFY_PIN: '/withdrawals/verify-pin',
    },
    
    // OTP endpoints
    OTP: {
      REQUEST: '/otp/request',
      VERIFY: '/otp/verify',
    },
    
    // Notification endpoints
    NOTIFICATION: {
      LIST: '/notifications',
      MARK_READ: '/notifications/mark-read/',
      MARK_ALL_READ: '/notifications/mark-all-read',
    },
  },
  
  // Helper function to get full API URL
  getApiUrl: function(endpoint) {
    return this.BASE_URL + endpoint;
  },
  
  // Helper function to handle API responses
  handleResponse: async function(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  },
  
  // Helper function to make API requests with authentication
  fetchWithAuth: async function(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
    
    const response = await fetch(this.getApiUrl(endpoint), {
      ...options,
      headers,
    });
    
    return this.handleResponse(response);
  },
};
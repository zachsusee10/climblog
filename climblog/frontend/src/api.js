export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080/api';

// Get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('climblog_token');
};

// Make authenticated API request
export const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, clear token
    if (response.status === 401) {
      localStorage.removeItem('climblog_token');
      localStorage.removeItem('climblog_user');
      throw new Error('Unauthorized');
    }

    // For 403, it might be a permission issue or no data so don't clear token automatically
    // Let the caller decide what to do
    
    return response;
  } catch (error) {
    // Network errors or other fetch errors
    if (error.message === 'Unauthorized') {
      throw error;
    }
    throw error;
  }
};

// API configuration and helper functions
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

// API call wrapper with auth header
export const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Auth API calls
export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    register: (userData) => apiCall(`/auth/register/${userData.role}`, {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    getCurrentUser: () => apiCall('/auth/me'),

    logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

export default API_BASE_URL;

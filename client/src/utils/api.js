const API_BASE_URL = 'http://localhost:5000/api/v1';

const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};
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

export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    register: (userData) => apiCall(`/auth/register/${userData.role}`, {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    googleLogin: (credential) => apiCall('/auth/google/login', {
        method: 'POST',
        body: JSON.stringify({ credential }),
    }),

    googleSignup: (credential, role) => apiCall('/auth/google/signup', {
        method: 'POST',
        body: JSON.stringify({ credential, role }),
    }),

    getCurrentUser: () => apiCall('/auth/me'),

    logout: () => apiCall('/auth/logout', { method: 'POST' }),
};

export const propertyAPI = {
    getAllProperties: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/properties${queryString ? `?${queryString}` : ''}`);
    },

    getPropertyById: (id) => apiCall(`/properties/${id}`),

    getMyProperties: () => apiCall('/properties/landlord/my-properties'),

    getStats: () => apiCall('/properties/landlord/stats'),

    createProperty: (data) => apiCall('/properties', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    updateProperty: (id, data) => apiCall(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    deleteProperty: (id) => apiCall(`/properties/${id}`, {
        method: 'DELETE',
    }),

    toggleStatus: (id) => apiCall(`/properties/${id}/toggle-active`, {
        method: 'PATCH',
    }),

    searchColleges: (query) => {
        const queryString = new URLSearchParams({ query }).toString();
        return apiCall(`/properties/colleges/search?${queryString}`);
    },

    getPropertiesNearCollege: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/properties/near-college?${queryString}`);
    },

    getNearbyColleges: (lat, lon, maxDistance = 10) => {
        const queryString = new URLSearchParams({ lat, lon, maxDistance }).toString();
        return apiCall(`/properties/nearby-colleges?${queryString}`);
    },
};

export const paymentAPI = {
    createOrder: () => apiCall('/payments/create-order', {
        method: 'POST',
    }),

    verifyPayment: (data) => apiCall('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    getMyPayments: () => apiCall('/payments/my-payments'),

    getPaymentById: (id) => apiCall(`/payments/${id}`),
};

export default API_BASE_URL;

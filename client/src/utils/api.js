const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://unirooms-01cba0aba98a.herokuapp.com/api/v1';
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
    updateProfile: (data) => apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
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
    createProperty: async (data) => {
        const token = localStorage.getItem('accessToken');
        if (data instanceof FormData) {
            const response = await fetch(`${API_BASE_URL}/properties`, {
                method: 'POST',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }
            return result;
        }
        return apiCall('/properties', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    updateProperty: async (id, data) => {
        const token = localStorage.getItem('accessToken');
        if (data instanceof FormData) {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
                method: 'PUT',
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: data,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }
            return result;
        }
        return apiCall(`/properties/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
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
    getAllCampuses: () => {
        return apiCall(`/properties/campuses`);
    },
};
export const paymentAPI = {
    createOrder: (data) => apiCall('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify(data || {}),
    }),
    verifyPayment: (data) => apiCall('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    getMyPayments: () => apiCall('/payments/my-payments'),
    getPaymentById: (id) => apiCall(`/payments/${id}`),
    createDonation: (data) => apiCall('/payments/donate', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    verifyDonation: (data) => apiCall('/payments/donate/verify', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};
export const savedPropertyAPI = {
    getSavedProperties: () => apiCall('/saved'),
    saveProperty: (propertyId) => apiCall(`/saved/${propertyId}`, {
        method: 'POST',
    }),
    unsaveProperty: (propertyId) => apiCall(`/saved/${propertyId}`, {
        method: 'DELETE',
    }),
    checkIfSaved: (propertyId) => apiCall(`/saved/check/${propertyId}`),
};
export default API_BASE_URL;

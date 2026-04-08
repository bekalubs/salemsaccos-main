import axios from 'axios';

// Create an Axios instance with base configuration
export const apiClient = axios.create({
  baseURL: 'http://142.132.180.209:4583/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API for profile view and management
export const usersAPI = {
  getProfile: async (username: string) => {
    return apiClient.get(`/users/profile/${username}`);
  },
  updateProfile: async (username: string, data: any) => {
    return apiClient.put(`/users/update/${username}`, data);
  },
  changePassword: async (username: string, data: { password: string }) => {
    const profileRes = await apiClient.get(`/users/profile/${username}`);
    const profile = profileRes.data?.data || profileRes.data;
    return apiClient.put(`/users/update/${username}`, {
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role || 'TELLER',
      password: data.password
    });
  },
  getAll: async (params?: { page?: number; size?: number; sortBy?: string; direction?: string; search?: string }) => {
    return apiClient.get('/users/all', { params });
  },
  register: async (data: any) => {
    return apiClient.post('/users/register', { ...data, role: 'TELLER' }); // Force TELLER role
  },
  delete: async (username: string) => {
    return apiClient.delete(`/users/${username}`);
  }
};

export const dashboardAPI = {
  getSummary: async () => {
    return apiClient.get('/dashboard/summary');
  }
};

export const authAPI = {
  login: async (credentials: any) => {
    return apiClient.post('/users/login', credentials);
  }
};

export const membersAPI = {
  getAll: async (options: {
    name?: string;
    surname?: string;
    memberCode?: string;
    nationalId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sortDirection?: string;
  } = {}) => {
    const params = new URLSearchParams();
    if (options.name) params.append('name', options.name);
    if (options.surname) params.append('surname', options.surname);
    if (options.memberCode) params.append('memberCode', options.memberCode);
    if (options.nationalId) params.append('nationalId', options.nationalId);
    if (options.status) params.append('status', options.status);
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.page !== undefined) params.append('page', String(options.page));
    if (options.size !== undefined) params.append('size', String(options.size));
    if (options.sortDirection) params.append('sortDirection', options.sortDirection);
    return apiClient.get(`/members?${params.toString()}`);
  },
  find: async (filters: {
    name?: string;
    surname?: string;
    memberCode?: string;
    nationalId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    sortDirection?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.surname) params.append('surname', filters.surname);
    if (filters.memberCode) params.append('memberCode', filters.memberCode);
    if (filters.nationalId) params.append('nationalId', filters.nationalId);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
    return apiClient.get(`/members/find?${params.toString()}`);
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/members/${id}`);
    if (res.data && typeof res.data === 'object' && 'data' in res.data) {
      return res.data.data;
    }
    return res.data;
  },
  update: async (id: string, data: any) => {
    return apiClient.put(`/members/${id}`, data);
  },
  create: async (data: any, branchCode: number = 1) => {
    return apiClient.post(`/members?branchCode=${branchCode}`, data);
  },
  delete: async (id: string) => {
    return apiClient.delete(`/members/${id}`);
  },
  getStatistics: async () => {
    return apiClient.get('/members/statistics');
  }
};

export const nomineesAPI = {
  getByMember: async (memberId: string) => {
    return apiClient.get(`/member-nominees/member/${memberId}`);
  },
  getById: async (id: string) => {
    return apiClient.get(`/member-nominees/${id}`);
  },
  update: async (id: string, data: any) => {
    return apiClient.put(`/member-nominees/${id}`, data);
  },
  create: async (data: any) => {
    return apiClient.post(`/member-nominees`, data);
  },
  delete: async (id: string) => {
    return apiClient.delete(`/member-nominees/${id}`);
  }
};

// Attach JWT token to all requests if available
apiClient.interceptors.request.use(
  (config: any) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Global response interceptor for handling 401 Unauthorized errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

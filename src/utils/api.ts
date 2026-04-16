import axios from 'axios';
import { getAuthToken, isTokenExpired, clearAuthData } from './jwt';

// Create an Axios instance with base configuration
export const apiClient = axios.create({
  baseURL: 'https://api.v1.temp.salemsaccos.com/api/v1',
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Check if the request is for public routes (registration or file upload)
    const url = config.url?.split('?')[0];
    const isPublicRoute = (url === '/members' && config.method === 'post') || 
                          (url === '/members/upload' && config.method === 'post') ||
                          url?.includes('/users/login');

    if (isPublicRoute) {
      // Don't add token for public registration/upload/login
      return config;
    }

    const token = getAuthToken();
    if (token) {
      if (isTokenExpired(token)) {
        clearAuthData();
        // Redirect to login if on protected route? 
        // For now just don't add the token and let the backend 401
        return config;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Unauthorized/Forbidden access. Clearing auth data and logging out.');
      clearAuthData();
      // Only reload if we were previously logged in to avoid infinite loops on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
  uploadFile: async (file: File | Blob, type: string) => {
    const formData = new FormData();
    const filename = (file as File).name || `${type.toLowerCase()}_${Date.now()}.png`;
    
    formData.append('file', file, filename);
    
    console.log('--- Uploading File ---');
    console.log('File Object:', file);
    console.log('Type (Query Param):', type);
    
    if (file.size === 0) {
      throw new Error('File is empty');
    }
    
    return apiClient.post(`/members/upload`, formData, {
      params: { type }
    });
  },
  delete: async (id: string) => {
    return apiClient.delete(`/members/${id}`);
  },
  getStatistics: async () => {
    return apiClient.get('/members/statistics');
  },
  getFileUrl: (type: string, filename: string) => {
    return `https://api.v1.temp.salemsaccos.com/api/v1/members/files/${type}/${filename}`;
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

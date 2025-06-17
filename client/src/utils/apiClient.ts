import { API_ENDPOINTS } from '@/config/api';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    
    // Handle validation errors
    if (response.status === 400 && error.errors) {
      throw new ApiError(response.status, JSON.stringify(error.errors));
    }
    
    throw new ApiError(response.status, error.message || 'An error occurred');
  }
  return response.json();
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new ApiError(401, 'No authentication token');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  });

  return handleResponse<T>(response);
}

export async function downloadFile(endpoint: string, filename: string): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new ApiError(401, 'No authentication token');
  }

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Download failed' }));
    throw new ApiError(response.status, error.message || 'Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// API methods
export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient<{ token: string }>(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
        requiresAuth: false,
      }),
  },
  analytics: {
    getAnalytics: () =>
      apiClient<{ data: any }>(API_ENDPOINTS.ANALYTICS),
    exportData: (filename: string) =>
      downloadFile(API_ENDPOINTS.ANALYTICS_EXPORT, filename),
  },
  waitlist: {
    register: (data: any) =>
      apiClient<{ message: string }>(API_ENDPOINTS.WAITLIST_REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          firstName: data.firstName?.trim(),
          lastName: data.lastName?.trim(),
          email: data.email?.trim(),
          phone: data.phone?.trim(),
          company: data.company?.trim(),
          role: data.role?.trim(),
          companySize: data.companySize?.trim(),
          industry: data.industry?.trim(),
          currentTools: data.currentTools?.trim() || '',
          painPoints: data.painPoints?.trim(),
          hearAbout: data.hearAbout?.trim(),
          newsletter: Boolean(data.newsletter),
          terms: Boolean(data.terms)
        }),
        requiresAuth: false,
      }),
    verify: (data: { email: string; code: string }) =>
      apiClient<{ message: string }>(API_ENDPOINTS.WAITLIST_VERIFY, {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false,
      }),
    resendVerification: (data: { email: string }) =>
      apiClient<{ message: string }>(API_ENDPOINTS.WAITLIST_RESEND, {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false,
      }),
  },
} as const; 
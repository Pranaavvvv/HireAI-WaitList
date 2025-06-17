export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/admin/login`,
  
  // Analytics endpoints
  ANALYTICS: `${API_BASE_URL}/analytics`,
  ANALYTICS_EXPORT: `${API_BASE_URL}/analytics/export`,
  
  // Waitlist endpoints
  WAITLIST_REGISTER: `${API_BASE_URL}/waitlist/register`,
  WAITLIST_VERIFY: `${API_BASE_URL}/waitlist/verify`,
  WAITLIST_RESEND: `${API_BASE_URL}/waitlist/resend`,
  WAITLIST_ALL: `${API_BASE_URL}/waitlist/all`,
} as const; 
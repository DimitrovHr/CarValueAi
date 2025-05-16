// API configuration
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper function to build API URLs
export function getApiUrl(endpoint: string): string {
  // If API_URL is set (in production), use it
  // Otherwise, use relative URLs (for development)
  return API_URL ? `${API_URL}${endpoint}` : endpoint;
}
import { useMutation } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL;

export const usePostDataWithToken = (endpoint) => {
  return useMutation({
    mutationFn: async ({ formData, token }) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        localStorage.removeItem('LaminaxUser');
        localStorage.removeItem('LaminaxAuthToken');
        
        // Redirect to login page
        window.location.href = '/login';
        
        throw new Error('Session Expired. Redirecting to login...');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to post data');
      }

      return response.json();
    },
  });
};
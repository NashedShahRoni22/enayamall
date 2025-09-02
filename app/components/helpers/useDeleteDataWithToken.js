import { useMutation } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL;

export const useDeleteDataWithToken = () => {
  return useMutation({
    mutationFn: async ({ endpoint, token, guestToken }) => {
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append('_method', 'DELETE');
      
      // Add guest_token to body if provided
      if (guestToken) {
        urlEncodedData.append('guest_token', guestToken);
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: urlEncodedData,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to delete data');
      }

      return response.json();
    },
  });
};
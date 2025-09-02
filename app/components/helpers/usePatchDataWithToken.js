import { useMutation } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL;

export const usePatchDataWithToken = () => {
  return useMutation({
    mutationFn: async ({ endpoint, token, formData }) => {
      // Convert FormData to URLSearchParams for proper URL encoding
      const urlParams = new URLSearchParams();
      
      if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
          urlParams.append(key, value);
        }
      } else if (formData instanceof URLSearchParams) {
        // If it's already URLSearchParams, use it directly
        for (const [key, value] of formData.entries()) {
          urlParams.append(key, value);
        }
      } else {
        // If it's an object, convert to URLSearchParams
        Object.keys(formData).forEach(key => {
          urlParams.append(key, formData[key]);
        });
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: urlParams,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to update data');
      }

      return response.json();
    },
  });
};
import { useMutation } from '@tanstack/react-query';

const BASE_URL = process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL;

export const usePostData = (endpoint) => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to post data');
      }

      return response.json();
    },
  });
};

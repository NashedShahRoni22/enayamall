import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_LAMINUX_API_BASE_URL;

export const useGetDataWithToken = (endpoint, token, enabled = true) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [endpoint, token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No token provided");
      }
      
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Handle 401 Unauthorized - redirect to login
      if (res.status === 401) {
        localStorage.removeItem('EnayamallUser');
        localStorage.removeItem('EnayamallAuthToken');
        
        // Redirect to login page
        window.location.href = '/login';
        
        throw new Error('Session Expired. Redirecting to login...');
      }
      
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      
      return res.json();
    },
    enabled: enabled && !!token,
  });

  return { data, error,  isLoading: enabled && !!token ? isLoading : false, isError };
};
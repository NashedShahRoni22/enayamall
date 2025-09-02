import { useQuery } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL;

export const useGetData = (endpoint, params = {}) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}${endpoint}`);

      // Query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              url.searchParams.append(`${key}[]`, val);
            });
          } else {
            url.searchParams.append(key, value);
          }
        }
      });

      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    },
  });
  return { data, error, isLoading, isError };
};

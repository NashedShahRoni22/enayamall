import { useMutation } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_API_BASE_URL;

export const useRemoveCoupon = () => {
  return useMutation({
    mutationFn: async ({ couponCode, token, guestToken }) => {
      const formData = new FormData();
      //   formData.append('coupon_code', couponCode);
      formData.append("guest_token", guestToken);

      const headers = {};

      // Add Authorization header if token exists (for authenticated users)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}remove-coupon`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to remove coupon");
      }

      const data = await response.json();
      return data;
    },
  });
};

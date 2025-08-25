'use client';

import toast from 'react-hot-toast';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePostDataWithToken } from '../components/helpers/usePostDataWithToken';
import { useGetDataWithToken } from '../components/helpers/useGetDataWithToken';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteDataWithToken } from '../components/helpers/useDeleteDataWithToken';
import { useGetData } from '../components/helpers/useGetData';
import { usePostData } from '../components/helpers/usePostData';

// Create a global context for app-wide state
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // to refetch data 
  const queryClient = useQueryClient();
  // ✅ Add loading state to track initialization
  const [loading, setLoading] = useState(true);
  // Global authentication token
  const [token, setToken] = useState(null);
  // Global guest token - available throughout the app
  const [guestToken, setGuestToken] = useState(null);
  // Global state for user authentication info
  const [user, setUser] = useState(null);

  // Generate or retrieve guest token
  const generateGuestToken = () => {
    let storedGuestToken = localStorage.getItem('guest_token');
    if (!storedGuestToken) {
      storedGuestToken = crypto.randomUUID();
      localStorage.setItem('guest_token', storedGuestToken);
    }
    return storedGuestToken;
  };

  // ✅ Load user, cart, and guest token from localStorage once on app mount
  useEffect(() => {
    try {
      // Load auth token
      const authToken = localStorage.getItem('LaminaxAuthToken');
      if (authToken) setToken(authToken);

      // Load user
      const storedUser = localStorage.getItem('LaminaxUser');
      if (storedUser) setUser(JSON.parse(storedUser));

      // Generate and set guest token globally
      const generatedGuestToken = generateGuestToken();
      setGuestToken(generatedGuestToken);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      // ✅ Set loading to false after initialization is complete
      setLoading(false);
    }
  }, []);

  // ✅ Add login function to update token and persist it
  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem('LaminaxAuthToken', newToken);

    if (userData) {
      setUser(userData);
      localStorage.setItem('LaminaxUser', JSON.stringify(userData));
    }
  };

  // ✅ Add logout function to clear token and user data
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('LaminaxAuthToken');
    localStorage.removeItem('LaminaxUser');
  };

  // ✅ Add product to cart DB 
  const postCart = usePostDataWithToken('add-to-cart');

  const addToCartDB = async (productVariantId, quantity, product_type, type) => {
    const formData = new FormData();
    if (product_type === "combo") {
      formData.append('combo_id', productVariantId);
    }
    else {
      formData.append('product_variant_id', productVariantId);
    }
    formData.append('quantity', quantity);
    formData.append('type', type);

    try {
      await toast.promise(
        postCart.mutateAsync({ formData, token }),
        {
          loading: 'Updating cart...',
          success: 'Cart Updated!',
          error: (err) => err.message || 'Failed to add product to cart',
        }
      );

      // ✅ Only happens if mutation is successful
      queryClient.invalidateQueries({ queryKey: ['cart'] });

    } catch (error) {
      // ❌ Don't refetch, error already shown via toast
    }
  };

  // get cart data
  const { data: cartData } = useGetDataWithToken(`cart`, token);
  const cartDB = cartData?.data;
  // Calculate total
  const totalDB = cartData?.meta?.sub_total;
  const totalDiscountDB = cartData?.meta?.product_discount;

  // ✅ Total number of items in wishlist
  const cartDBCount = Array.isArray(cartDB) ? cartDB.length : 0;

  // ✅ Add product to cart DB guest 
  const postCartGuest = usePostData('add-to-cart-guest');

  const addToCartDBGuest = async (productVariantId, quantity, product_type, type) => {
    const formData = new FormData();
    if (product_type === "combo") {
      formData.append('combo_id', productVariantId);
    }
    else {
      formData.append('product_variant_id', productVariantId);
    }
    formData.append('quantity', quantity);
    formData.append('type', type);
    formData.append('guest_token', guestToken);

    try {
      await toast.promise(
        postCartGuest.mutateAsync(formData),
        {
          loading: 'Updating cart...',
          success: 'Cart Updated!',
          error: (err) => err.message || 'Failed to add product to cart',
        }
      );

      // ✅ Only happens if mutation is successful
      queryClient.invalidateQueries({ queryKey: [`guest-cart?guest_token=${guestToken}`] });

    } catch (error) {
      // ❌ Don't refetch, error already shown via toast
    }
  };

  // get cart data Guest
  const { data: cartDataGuest } = useGetData(`guest-cart?guest_token=${guestToken}`);
  const cartDBGuest = cartDataGuest?.data;
  // Calculate total
  const totalDBGuest = cartDataGuest?.meta?.sub_total;
  const totalDiscountGuestDB = cartDataGuest?.meta?.product_discount;

  // ✅ Total number of items in wishlist
  const cartDBCountGuest = Array.isArray(cartDBGuest) ? cartDBGuest.length : 0;

  // ✅ Add product to wishlist 
  const postWishlist = usePostDataWithToken('wishlist');

  const addToWishlist = async (productVariantId, type) => {
    const formData = new FormData();
    if (type === "combo") {
      formData.append('combo_id', productVariantId);
    }
    else {
      formData.append('product_variant_id', productVariantId);
    }

    try {
      await toast.promise(
        postWishlist.mutateAsync({ formData, token }),
        {
          loading: 'Adding product to wishlist...',
          success: 'Product added to wishlist!',
          error: (err) => err.message || 'Failed to add product to wishlist',
        }
      );

      // ✅ Only happens if mutation is successful
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });

    } catch (error) {
      // ❌ Don't refetch, error already shown via toast
    }
  };

  // get wishlist data
  const { data: wishlistData } = useGetDataWithToken(`wishlist`, token);
  const wishlist = wishlistData?.data;
  // ✅ Total number of items in wishlist
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  // Remove item from cart and wishlist db
  const deleteItem = useDeleteDataWithToken();

  // ✅ Remove item from cart DB
  const removeFromCartDB = async (cartId) => {
    try {
      await toast.promise(
        deleteItem.mutateAsync({
          endpoint: `cart/${cartId}`,
          token,
        }),
        {
          loading: 'Removing item from cart...',
          success: 'Item removed from cart!',
          error: (err) => err.message || 'Failed to remove item',
        }
      );
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      // Error handled by toast
    }
  };

  // ✅ Remove item from cart Guest
  const removeFromCartDBGuest = async (cartId) => {
    try {
      await toast.promise(
        deleteItem.mutateAsync({
          endpoint: `guest-cart/${cartId}`,
          guestToken,
        }),
        {
          loading: 'Removing item from cart...',
          success: 'Item removed from cart!',
          error: (err) => err.message || 'Failed to remove item',
        }
      );
      queryClient.invalidateQueries({
        queryKey: [`guest-cart?guest_token=${guestToken}`]
      });
    } catch (error) {
      // Error handled by toast
    }
  };

  // For wishlist items
  const removeFromWishlistDB = async (wishlistId) => {
    try {
      await toast.promise(
        deleteItem.mutateAsync({
          endpoint: `wishlist/${wishlistId}`,
          token,
        }),
        {
          loading: 'Removing item from wishlist...',
          success: 'Item removed from wishlist!',
          error: (err) => err.message || 'Failed to remove item',
        }
      );
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch (error) {
      // Error handled by toast
    }
  };

  // get categories
  const { data: categoriesData } = useGetData(`categories`);
  const categories = categoriesData?.data;

  // get brands
  const { data: brandsData } = useGetData(`brands`);
  const brands = brandsData?.data;

  // get skin types
  const { data: skinTypesData } = useGetData(`skin-types`);
  const skinTypes = skinTypesData?.data;

  return (
    <AppContext.Provider
      value={{
        loading,
        token,
        setToken,
        login,
        logout,
        guestToken,
        user,
        setUser,
        totalDiscountDB,
        cartDB,
        cartDBCount,
        wishlistCount,
        totalDB,
        addToWishlist,
        wishlist,
        addToCartDB,
        removeFromCartDB,
        removeFromWishlistDB,
        categories,
        brands,
        skinTypes,
        addToCartDBGuest,
        removeFromCartDBGuest,
        cartDBGuest,
        totalDBGuest,
        cartDBCountGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easier access to context throughout the app
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
};
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import ScreenLoader from '../../loaders/ScreenLoader';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAppContext();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      const returnTo = window.location.pathname;
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
    } else {
      setCheckingAuth(false);
    }
  }, [token, loading, router]);

  // Show loading while context is initializing or checking auth
  if (loading || checkingAuth) {
    return (
      <ScreenLoader />
    );
  }

  return children;
};

export default PrivateRoute;
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import ScreenLoader from '../../loaders/ScreenLoader';

const PublicRoute = ({ children }) => {
    const { token, loading } = useAppContext();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (token) {
            router.replace('/account');
        }
    }, [token, loading, router]);

    // Show loading while context is initializing
    if (loading) {
        return (
            <ScreenLoader/>
        );
    }

    if (token) {
        return null;
    }

    return children;
};

export default PublicRoute;
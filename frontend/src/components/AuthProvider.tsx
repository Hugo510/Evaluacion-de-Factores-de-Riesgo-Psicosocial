import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { loadUser } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                await loadUser();
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        initAuth();
    }, [loadUser]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    return <>{children}</>;
};

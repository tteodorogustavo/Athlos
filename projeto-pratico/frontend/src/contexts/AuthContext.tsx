'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';
import { User, AuthContextType } from '@/lib/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = Cookies.get('access_token');
            if (token) {
                const userData = await authAPI.getMe();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const data = await authAPI.login(email, password);
        Cookies.set('access_token', data.access, { expires: 1 });
        Cookies.set('refresh_token', data.refresh, { expires: 7 });

        // Pegar dados do usuário a partir da resposta de login
        const userData = data.user || await authAPI.getMe();
        setUser(userData);

        // Redirecionar baseado no tipo de usuário
        switch (userData.user_type) {
            case 'PERSONAL':
                router.push('/dashboard/personal');
                break;
            case 'ALUNO':
                router.push('/dashboard/aluno');
                break;
            case 'ADMIN':
                router.push('/dashboard/academia');
                break;
            case 'ADMIN_SISTEMA':
                router.push('/dashboard/admin');
                break;
            default:
                router.push('/dashboard');
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

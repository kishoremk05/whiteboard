import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { mockUser } from '../data/mockData';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('ai-whiteboard-user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('ai-whiteboard-user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, _password: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const loggedInUser = { ...mockUser, email };
        setUser(loggedInUser);
        localStorage.setItem('ai-whiteboard-user', JSON.stringify(loggedInUser));
        setIsLoading(false);
    };

    const signup = async (email: string, _password: string, name: string) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newUser: User = {
            ...mockUser,
            id: `user-${Date.now()}`,
            email,
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('ai-whiteboard-user', JSON.stringify(newUser));
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(null);
        localStorage.removeItem('ai-whiteboard-user');
        setIsLoading(false);
    };

    const resetPassword = async (_email: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
            setUser(updatedUser);
            localStorage.setItem('ai-whiteboard-user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                resetPassword,
                updateUser,
            }}
        >
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

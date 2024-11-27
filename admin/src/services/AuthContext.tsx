import React, { createContext, useState, useEffect } from 'react';
import User from "@models/User";
import useMutation from './useMutation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    hasPermission: (permission: string[] | string) => boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
    hasPermission: (permission: string | string[]) => { return false; }
});

const useFetchUserData = (setUser: (user: User | null) => void, setLoading: (loading: boolean) => void) => {
    const mutate = useMutation({
        url: "auth/user",
        success: (data: any) => {
            if(data.success){
                setUser(data.user);
            } else {
                localStorage.removeItem("token");
            }
            setLoading(false);
        },
        error: (error: any) => {
            console.error("Erreur lors de la récupération de l'utilisateur", error);
            localStorage.removeItem("token");
        }
    });

    return mutate;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchUserData = useFetchUserData(setUser, setLoading);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUserData.mutate({}); 
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        fetchUserData.mutate({}); 
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const hasPermission = (permissions: string | string[]) => {
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }
        return permissions.some(permission => user?.permissions.includes(permission) || user?.roleId === 1) || false;
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

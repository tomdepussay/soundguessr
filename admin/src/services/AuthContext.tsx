import React, { createContext, useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import User from "@models/User";

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = useLocalStorage("token", null);
        if (token) {
            // Valider le token et récupérer les informations de l'utilisateur
            //   fetchUserData(token);
        }
    }, []);

    //   const fetchUserData = async (token) => {
    //     try {
    //       const response = await fetch('/api/user', {
    //         headers: {
    //           'Authorization': `Bearer ${token}`
    //         }
    //       });
    //       const data = await response.json();
    //       setUser(data.user);
    //     } catch (error) {
    //       console.error("Erreur lors de la récupération de l'utilisateur", error);
    //       localStorage.removeItem("token");
    //     }
    //   };

    const login = (token: string) => {
        useLocalStorage("token", token);
        // fetchUserData(token);
    };

    const logout = () => {
        useLocalStorage("token", null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

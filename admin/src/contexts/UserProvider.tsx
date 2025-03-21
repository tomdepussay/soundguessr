'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient , useMutation } from "@tanstack/react-query";

type User = {
    id_user: number;
    username: string;
    email: string;
    id_role: number;
    id_picture: number;
};

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { }
});

const fetchUser = async () => {
    const res = await fetch("/api/users/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Échec de la récupération de l'utilisateur");
    return res.json();
}

export function UserProvider({ children }: { children: ReactNode }) {

    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);

    const { mutate } = useMutation({
        mutationFn: fetchUser,
        onMutate: () => {
            queryClient.setQueryData(["user"], user);
        },
        onError: () => {
            queryClient.setQueryData(["user"], null);
        },
        onSuccess: (data) => {
            setUser(data.user);
        },
    }); 

    useEffect(() => {
        mutate();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
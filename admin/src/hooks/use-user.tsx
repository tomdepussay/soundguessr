import { create } from "zustand";
import { User } from "@/src/types/User";

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
}))
"use client"

import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { UserProvider } from '@/src/contexts/UserProvider';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </UserProvider>
        </QueryClientProvider>
    );
}
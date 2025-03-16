"use client";

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeProvider";
import { cn } from "./../lib/utils";

export default function Body ({ children }: Readonly<{ children: React.ReactNode }>) {
    
    const { theme } = useContext(ThemeContext);

    return (
        <body className={cn("bg-background text-foreground min-h-screen h-full", theme)}>
            {children}
        </body>
    );
}
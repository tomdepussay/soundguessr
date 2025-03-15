import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Admin - Soundguessr",
    description: "Administration de Soundguessr",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="h-full w-full">
            <body className="bg-background text-foreground min-h-screen h-full ">
                {children}
            </body>
        </html>
    );
}
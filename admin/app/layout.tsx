import type { Metadata } from "next";
import "./globals.css";
import Body from "@/src/components/Body";
import Providers from "@/src/components/Providers";

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
            <Providers>
                <Body>
                    {children}
                </Body>
            </Providers>
        </html>
    );
}
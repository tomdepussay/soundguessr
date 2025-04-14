import type { Metadata } from "next";
// import { verifySession } from "./session";

export const metadata: Metadata = {
    title: "Soundguessr - Media",
    description: "Soundguessr - Media",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import "./globals.css";
import Body from "@/src/components/Body";
import Providers from "@/src/components/Providers";
import Nav from "@/src/components/Nav";
import { Book, Monitor, Shield, Users, Zap, Gamepad } from "lucide-react";
import { verifySession } from "@/src/lib/session";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
    title: "Admin - Soundguessr",
    description: "Administration de Soundguessr",
};

const navItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: <Monitor />,
    },
    {
        title: "Droits",
        url: "#",
        permission: "admin.rights",
        icon: <Shield />,
        items: [
            {
                title: "Roles",
                permission: 'admin.rights.roles',
                url: "/roles"
            },
            {
                title: "Permissions",
                permission: 'admin.rights.permissions',
                url: "/permissions"
            }
        ]
    },
    {
        title: "Référentiels",
        url: "#",
        icon: <Book />,
        items: [
            {
                title: "Catégories",
                url: "/categories"
            },
            {
                title: "Networks",
                url: "/networks"
            }
        ]
    },
    {
        title: "Animes",
        url: "#",
        icon: <Zap />,
        items: [
            {
                title: "Animes",
                url: "/animes"
            },
            {
                title: "Saisons",
                url: "/seasons"
            },
            {
                title: "Opening",
                url: "/openings"
            },
            {
                title: "Ending",
                url: "/endings"
            }
        ]
    },
    {
        title: "Utilisateurs",
        url: "/users",
        icon: <Users />
    },
    {
        title: "Parties",
        url: "/games",
        icon: <Gamepad />
    }
];

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await verifySession()
    
    if(!session?.id) {
        return (
            <html lang="fr" className="h-full w-full">
                <body className="h-full w-full flex flex-col items-center justify-center">
                    <main>
                        {children}
                    </main>
                </body>
            </html>
        )
    } else {
        return (
            <>
                <html lang="fr" className="h-full w-full">
                    <Providers>
                        <Body>
                            <header>
                                <Nav navItems={navItems} />
                            </header>
                            <main className="h-full w-full md:p-2 bg-sidebar">
                                <div className="h-full w-full bg-background rounded overflow-y-auto">
                                    {children}
                                </div>
                            </main>
                        </Body>
                    </Providers>
                </html>
                <ToastContainer
                    position="bottom-right"
                />
            </>
        );
    }
}
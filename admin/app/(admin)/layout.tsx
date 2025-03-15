import Nav from "@/src/components/Nav";
import { Book, Monitor, Shield, Users, Zap, Gamepad } from "lucide-react";

const navItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: <Monitor />,
    },
    {
        title: "Droits",
        url: "#",
        icon: <Shield />,
        items: [
            {
                title: "Roles",
                url: "/roles"
            },
            {
                title: "Permissions",
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

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="md:flex h-full md:h-screen">
            <header>
                <Nav navItems={navItems} />
            </header>
            <main className="h-full w-full">
                {children}
            </main>
        </div>
    )
}
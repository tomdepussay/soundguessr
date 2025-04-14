import { Book, Monitor, Shield, Users, Zap, Gamepad } from "lucide-react";
import { permission } from "process";

export const navItems = [
    {
        title: "Dashboard",
        url: "/",
        permission: "admin",
        icon: <Monitor />,
    },
    {
        title: "Droits",
        url: "",
        permission: "admin.rights",
        icon: <Shield />,
        items: [
            {
                title: "Roles",
                url: "/roles",
                permission: 'admin.rights.roles'
            },
            {
                title: "Permissions",
                url: "/permissions",
                permission: 'admin.rights.permissions'
            }
        ]
    },
    {
        title: "Référentiels",
        url: "",
        permission: "admin.references",
        icon: <Book />,
        items: [
            {
                title: "Catégories",
                url: "/categories",
                permission: 'admin.references.categories'
            },
            {
                title: "Networks",
                url: "/networks",
                permission: 'admin.references.networks'
            }
        ]
    },
    {
        title: "Animes",
        url: "",
        permission: "admin.animes",
        icon: <Zap />,
        items: [
            {
                title: "Animes",
                url: "/animes",
                permission: 'admin.animes.animes'
            },
            {
                title: "Saisons",
                url: "/seasons",
                permission: 'admin.animes.seasons'
            },
            {
                title: "Opening",
                url: "/openings",
                permission: 'admin.animes.openings'
            },
            {
                title: "Ending",
                url: "/endings",
                permission: 'admin.animes.endings'
            }
        ]
    },
    {
        title: "Utilisateurs",
        url: "/users",
        permission: "admin.users",
        icon: <Users />
    },
    {
        title: "Parties",
        url: "/games",
        permission: "admin.games",
        icon: <Gamepad />
    }
];
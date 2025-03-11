import Nav from "@/src/components/Nav";
import { Book, Folder, KeyRound, Monitor, Music, Network, Shield, SunSnow, UserRoundCog, Users, Zap, Gamepad, ChevronRight } from "lucide-react";


export default function Page() {
    return (
        <Nav navItems={[
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
            ]} />
    );
}
import Nav from "@/src/components/Nav";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Book, Folder, KeyRound, Monitor, Music, Network, Shield, SunSnow, UserRoundCog, Users, Zap, Gamepad, ChevronRight } from "lucide-react";

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
        <div className="flex h-full">
            <div className="w-full">
                <SidebarProvider>
                    <Nav navItems={navItems} />
                    <SidebarInset className="w-full">
                        <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                            <div className="flex items-center gap-2 px-4">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">
                                                Building Your Application
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
            {/* <main className="w-full bg-red-500">
                {children}
            </main> */}
        </div>
    )
}
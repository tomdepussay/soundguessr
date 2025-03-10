'use client'

import { Book, Folder, KeyRound, Monitor, Music, Network, Shield, SunSnow, UserRoundCog, Users, Zap, Gamepad, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import Link from "next/link";

const nav = [
    {
        title: "Dashboard",
        url: "/",
        icon: Monitor,
    },
    {
        title: "Droits",
        url: "#",
        icon: Shield,
        items: [
            {
                title: "Roles",
                url: "/roles",
                icon: UserRoundCog
            },
            {
                title: "Permissions",
                url: "/permissions",
                icon: KeyRound
            }
        ]
    },
    {
        title: "Référentiels",
        url: "#",
        icon: Book,
        items: [
            {
                title: "Catégories",
                url: "/categories",
                icon: Folder
            },
            {
                title: "Networks",
                url: "/networks",
                icon: Network
            }
        ]
    },
    {
        title: "Animes",
        url: "#",
        icon: Zap,
        items: [
            {
                title: "Animes",
                url: "/animes",
                icon: Zap
            },
            {
                title: "Saisons",
                url: "/seasons",
                icon: SunSnow
            },
            {
                title: "Opening",
                url: "/openings",
                icon: Music
            },
            {
                title: "Ending",
                url: "/endings",
                icon: Music
            }
        ]
    },
    {
        title: "Utilisateurs",
        url: "/users",
        icon: Users
    },
    {
        title: "Parties",
        url: "/games",
        icon: Gamepad
    }
];

export default function Nav(){
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <h1 className="text-foreground text-2xl font-bold flex items-center justify-center h-10 mt-1 w-full">Soundguessr</h1>
                    </SidebarHeader>
                    <SidebarGroup>
                        <SidebarMenu>
                            <Collapsible
                                key="1"
                                asChild
                                defaultOpen={false}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <Link href="/">
                                        <SidebarMenuButton tooltip="Dashboard">
                                            <Monitor />
                                            <span>Dashboard</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </Collapsible>
                            <Collapsible
                                key="2"
                                asChild
                                defaultOpen={false}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={"Droits"}>
                                            <Shield />
                                            <span>Droits</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem key="1">
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/roles">
                                                        <span>Roles</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem key="2">
                                                <SidebarMenuSubButton asChild>
                                                    <Link href="/permissions">
                                                        <span>Permissions</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}
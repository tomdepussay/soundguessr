'use client'

import { ChevronRight, LogOut, Menu } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import Link from "next/link";
import { JSX } from "react";
import LogoutAction from "./logout-action";

interface NavItem {
    title: string;
    url: string;
    icon?: JSX.Element;
    items?: NavItem[];
}

interface NavProps {
    navItems: NavItem[];
}

export default function Nav({ navItems = [] }: NavProps) {

    const handleLogout = async () => {
        await LogoutAction()
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarHeader>
                        <h1 className="text-foreground text-2xl font-bold flex items-center justify-center mt-1 h-10 w-full">Soundguessr</h1>
                        <SidebarTrigger className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" />
                    </SidebarHeader>
                    <SidebarGroup>
                        <SidebarMenu>
                            {
                                navItems.map((item, index) => {
                                    return <Collapsible
                                        key={index}
                                        asChild
                                        defaultOpen={false}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            {
                                                item.items ? <>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
                                                            {item.icon}
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {
                                                                item.items.map((subItem, index) => {
                                                                    return <SidebarMenuSubItem key={index}>
                                                                        <SidebarMenuSubButton className="cursor-pointer" asChild>
                                                                            <Link href={subItem.url}>
                                                                                <span>{subItem.title}</span>
                                                                            </Link>
                                                                        </SidebarMenuSubButton>
                                                                    </SidebarMenuSubItem>
                                                                })
                                                            }
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </> : <>
                                                    <Link href={item.url}>
                                                        <SidebarMenuButton className="cursor-pointer" tooltip={item.title}>
                                                            {item.icon}
                                                            <span>{item.title}</span>
                                                        </SidebarMenuButton>
                                                    </Link>
                                                </>
                                            }
                                        </SidebarMenuItem>

                                    </Collapsible>
                                })
                            }
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={handleLogout} className="cursor-pointer" tooltip="Deconnexion">
                                    <LogOut />
                                    <span>Deconnexion</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
}
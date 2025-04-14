'use client'

import { ThemeContext } from "@/src/contexts/ThemeProvider";
import { useContext, JSX } from "react";
import { useIsMobile } from "@/src/hooks/use-mobile"
import { ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import Link from "next/link";
import LogoutAction from "./logout-action";
import { usePermissions } from "../hooks/use-permissions";
    
interface NavItem {
    title: string;
    url: string;
    permission: string;
    icon?: JSX.Element;
    items?: NavItem[];
}

interface NavProps {
    navItems: NavItem[];
}

export default function Nav({ navItems = [] }: NavProps) {

    const { theme, toggleTheme } = useContext(ThemeContext);
    const { hasPermission, hasAnyPermission } = usePermissions();
    const isMobile = useIsMobile()

    const handleLogout = async () => {
        await LogoutAction()
    }
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader className="p-0 h-12 border-b flex justify-center items-center">
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                                <SidebarTrigger className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground" />
                                <h1 className="text-lg font-semibold">Soundguessr</h1>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {
                                navItems.map((item, index) => {
                                    if(!hasPermission(item.permission)) return null
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
                                                                    if(!hasPermission(subItem.permission)) return null
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
                <SidebarFooter className="border-t">
                    <SidebarGroup className="p-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={toggleTheme} className="cursor-pointer" tooltip="Changer de theme">
                                    {
                                        theme === "light" ? <Moon /> : <Sun />
                                    }
                                    <span>Changer de theme</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
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
            {
                isMobile && (
                    <div className="flex items-center justify-between h-12 w-full bg-sidebar border-b p-2">
                        <SidebarTrigger className="p-2 rounded-md" />
                        <h1 className="text-2xl font-semibold">Soundguessr</h1>
                        <SidebarTrigger className="p-2 rounded-md opacity-0" />
                    </div>
                )
            }
        </SidebarProvider>
    )
}
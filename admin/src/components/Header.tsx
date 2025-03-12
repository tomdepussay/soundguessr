import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "./ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

export default function Header(){
    return <header className="flex h-16 shrink-0 w-full items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
        </div>
    </header>
}
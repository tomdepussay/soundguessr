import prisma from "@/src/lib/prisma";
import { hasAccess } from "@/src/lib/session";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
    const { id } = await params    

    const hasPermission = await hasAccess("admin.animes.animes");
    
    if(!hasPermission) return redirect("/");

    const anime = await prisma.anime.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            title: true,
            isActive: true,
            top100: true,
            image: true,
        }
    })

    if(!anime) return redirect("/");

    return (
        <div>
            <div className="p-4 w-full flex justify-between items-center">
                <h2 className="text-xl font-bold">Animes : {anime.title}</h2>
            </div>
        </div>
    )
}
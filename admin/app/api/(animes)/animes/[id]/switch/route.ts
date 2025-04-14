import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Anime } from "@/src/types/Anime";
import { hasAccessApi } from "@/src/lib/session";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await hasAccessApi("admin.animes.animes.isActive");

        const anime: Anime | null = await prisma.anime.findUnique({
            where: { id: Number(id) }
        });

        if(!anime){
            throw new NextResponse("Anime non trouvé", { status: 404 });
        }

        const updatedAnime: Anime = await prisma.anime.update({
            where: { 
                id: Number(id) 
            },
            data: {
                isActive: !anime.isActive
            }
        });

        return NextResponse.json(updatedAnime);
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Anime } from "@/src/types/Anime";
import { hasAccessApi } from "@/src/lib/session";
import { deleteImage } from "@/src/lib/image";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { title, isActive, top100 } = await req.json();

    try {
        await hasAccessApi("admin.animes.animes.edit");

        const updatedAnime: Anime = await prisma.anime.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                title,
                isActive,
                top100
            },
        });

        return NextResponse.json(updatedAnime);
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await hasAccessApi("admin.animes.animes.delete");

        const anime = await prisma.anime.findUnique({
            where: { 
                id: Number(id) 
            },
            select: {
                image: {
                    select: {
                        id: true,
                        link: true,
                        extension: true,
                    }
                }
            }
        })

        console.log(anime);

        if(!anime) {
            throw NextResponse.json({ error: "Anime not found" }, { status: 404 })
        }

        if(anime.image){

            const { response } = await deleteImage(anime.image.link)

            console.log(response);
        }

        console.log("continue");
        return NextResponse.json({ message: "Image deleted" }, { status: 200 });

        await prisma.anime.delete({
            where: { 
                id: Number(id) 
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}

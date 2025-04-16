import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Anime } from "@/src/types/Anime";
import { hasAccessApi } from "@/src/lib/session";
import { uploadImage, deleteImage } from "@/src/lib/image";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { title, isActive, top100, image } = await req.json();
    let imageId = null;

    try {
        await hasAccessApi("admin.animes.animes.edit");

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

        if(!anime){
            throw NextResponse.json({ error: "Anime not found" }, { status: 404 })
        }

        if(anime.image && image !== 'data:application/octet-stream;base64,'){

            const { ok } = await deleteImage(anime.image.link)

            if(!ok) throw NextResponse.json({ error: "Erreur lors de la suppression de l'image" }, { status: 500 });

            const { newImage } = await uploadImage(image);

            if(!newImage) {
                throw new Error("Erreur lors de l'envoi de l'image");
            }

            imageId = newImage.id;

        }

        const updatedAnime: Anime = await prisma.anime.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                title,
                isActive,
                top100,
                imageId: imageId ? imageId : null,
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

        if(!anime) {
            throw NextResponse.json({ error: "Anime not found" }, { status: 404 })
        }

        if(anime.image){
            const { ok } = await deleteImage(anime.image.link)

            if(!ok) throw NextResponse.json({ error: "Erreur lors de la suppression de l'image" }, { status: 500 });
        }
        
        await prisma.anime.delete({
            where: { 
                id: Number(id) 
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}

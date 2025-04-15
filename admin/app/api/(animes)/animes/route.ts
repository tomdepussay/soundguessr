import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Anime } from "@/src/types/Anime";
import { hasAccessApi } from "@/src/lib/session";
import { uploadImage } from "@/src/lib/image";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {
        await hasAccessApi("admin.animes.animes");

        const animes: Anime[] = await prisma.anime.findMany({
            select: {
                id: true,
                isActive: true,
                title: true,
                top100: true,
                image: {
                    select: {
                        id: true,
                        link: true,
                    }
                }
            },
            orderBy: {
                id: "asc"
            },
            skip: (page - 1) * max,
            take: max,
        });

        const total = await prisma.anime.count();
        const pages = Math.ceil(total / max);

        return NextResponse.json({ animes, pages });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { title, isActive, top100, image } = await req.json();
    let imageId = null;

    try {
        await hasAccessApi("admin.animes.animes.add");
    
        if(image !== 'data:application/octet-stream;base64,') {
            const { newImage } = await uploadImage(image);

            if(!newImage) {
                throw new Error("Erreur lors de l'envoi de l'image");
            }
            imageId = newImage.id;
        }

        const newAnime: Anime = await prisma.anime.create({
            data: { 
                title,
                isActive,
                top100,
                imageId: imageId,
            },
        });

        return NextResponse.json(newAnime);
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
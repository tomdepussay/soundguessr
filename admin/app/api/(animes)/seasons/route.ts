import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Season } from "@/src/types/Season";
import { hasAccessApi } from "@/src/lib/session";
import { SeasonSchema } from "@/src/validation/season";

export async function GET(
    req: Request
) {

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const max = 10;

    try {
        await hasAccessApi("admin.animes.seasons");

        const seasons: Season[] = await prisma.season.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                id: "asc"
            },
            skip: (page - 1) * max,
            take: max,
        });

        const total = await prisma.season.count();
        const pages = Math.ceil(total / max);

        return NextResponse.json({ seasons, pages });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
    }
}

export async function POST(
    req: Request
){
    const { name } = await req.json();

    try {
        await hasAccessApi("admin.animes.seasons.add");
        
        const { success } = SeasonSchema.safeParse({ name });  
    
        if (!success) {
            throw NextResponse.json({ error: "Erreur de validation" }, { status: 422 });
        }
    
        const newSeason: Season = await prisma.season.create({
            data: { 
                name
            },
        });

        return NextResponse.json(newSeason);
    } catch (error) {
        console.log(error);
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { Season } from "@/src/types/Season";
import { hasAccessApi } from "@/src/lib/session";
import { SeasonSchema } from "@/src/validation/season";

export async function PUT(
    req: Request,
    { params } : { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { name } = await req.json();

    try {
        await hasAccessApi("admin.animes.seasons.edit");
        
        const { success } = SeasonSchema.safeParse({ name });  
    
        if (!success) {
            throw NextResponse.json({ error: "Erreur de validation" }, { status: 422 });
        }

        const updatedSeason: Season = await prisma.season.update({
            where: { 
                id: Number(id) 
            },
            data: { 
                name
            },
        });

        return NextResponse.json(updatedSeason);
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
        await hasAccessApi("admin.animes.seasons.delete");

        await prisma.season.delete({
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

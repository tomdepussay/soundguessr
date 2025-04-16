import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getInfoFile } from "@/src/lib/infoFile";
import path from "path";
import fs from "fs";
import prisma from "@/src/lib/prisma";
import { hasAccessApi } from "@/src/lib/session";

export async function POST(
    req: NextRequest
){
    const { image } = await req.json();

    const filePath = path.join(process.cwd(), 'public', 'images')

    try {
        await hasAccessApi("admin.images.add", req);
        
        let existingImage;
        let link;

        do {
            link = uuidv4();
            existingImage = await prisma.image.findFirst({
                where: { link },
                select: { id: true },
            });
        } while (existingImage);

        const { size, extension, base64Data } = await getInfoFile(image);
        const fileName = `${link}.${extension}`;

        const filePathFull = path.join(filePath, fileName);
        
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        fs.writeFileSync(filePathFull, Buffer.from(base64Data, 'base64'));

        const newImage = await prisma.image.create({
            data: {
                link,
                size,
                extension,
            }
        });

        return NextResponse.json({ newImage });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import { hasAccessApi } from '@/src/lib/session'

export async function GET(
    req: Request,
    { params } : { params: Promise<{ link: string }> }
) {
    const { link } = await params

    try {
        await hasAccessApi("admin.images")

        const image = await prisma.image.findUnique({
            where: {
                link: link,
            },
            select: {
                id: true,
                link: true,
                extension: true,
            }
        })
    
        if(!image) {
            throw NextResponse.json({ error: "Image not found" }, { status: 404 })
        }
        
        if(!image.extension) {
            throw NextResponse.json({ error: "Image extension not found" }, { status: 404 })
        }
    
        const filePath = path.join(process.cwd(), 'public', 'images', `${link}.${image?.extension}`)
    
        if (!fs.existsSync(filePath)){
            throw NextResponse.json({ error: "File not found" }, { status: 404 })
        }
    
        const fileBuffer = fs.readFileSync(filePath)
        const base64Image = fileBuffer.toString('base64')
        const fileName = path.basename(filePath)
        const fileType = path.extname(filePath).slice(1)
        const fileSize = fs.statSync(filePath).size
        const dataUrl = `data:image/${fileType};base64,${base64Image}`
    
        const fileData = {
            name: fileName,
            type: fileType,
            size: fileSize,
            file: dataUrl,
        }
    
        return NextResponse.json(fileData, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        })
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params } : { params: Promise<{ link: string }> }
) {
    const { link } = await params

    try {
        await hasAccessApi("admin.images.delete")

        const image = await prisma.image.findUnique({
            where: {
                link: link,
            },
            select: {
                id: true,
                link: true,
                extension: true,
            }
        })
    
        if(!image) {
            throw NextResponse.json({ error: "Image not found" }, { status: 404 })
        }
        
        if(!image.extension) {
            throw NextResponse.json({ error: "Image extension not found" }, { status: 404 })
        }
    
        const filePath = path.join(process.cwd(), 'public', 'images', `${link}.${image?.extension}`)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }

        return NextResponse.json({ message: "Image deleted" }, { status: 200 });
    } catch (error) {
        if (error instanceof NextResponse) return error;
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}
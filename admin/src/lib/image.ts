import 'server-only'
import { getAuthCookie } from './session'
import { NextResponse } from 'next/server'

export async function uploadImage(image: string) {
    const res = await fetch(`http://host.docker.internal:3002/images`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${await getAuthCookie()}`
        },
        body: JSON.stringify({ image }),
    });

    if (!res.ok) {
        throw NextResponse.json({ error: "Erreur lors de la création de l'image" }, { status: 400 })
    }

    return await res.json();
}

export async function deleteImage(link: string) {
    const res = await fetch(`http://host.docker.internal:3002/images/${link}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${await getAuthCookie()}`
        }
    });

    if (!res.ok) {
        throw NextResponse.json({ error: "Erreur lors de la suppression de l'image" }, { status: 400 })
    }

    return await res.json();
}
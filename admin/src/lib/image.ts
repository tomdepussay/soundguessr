import 'server-only'

export async function uploadImage(image: string) {
    const res = await fetch(`http://host.docker.internal:3002/images`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ image }),
    });

    if (!res.ok) {
        throw new Error("Erreur lors de l'envoi de l'image");
    }

    return await res.json();
}

export async function deleteImage(link: string) {
    const res = await fetch(`http://host.docker.internal:3002/images/${link}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!res.ok) {
        throw new Error("Erreur lors de la suppression de l'image");
    }

    return await res.json();
}
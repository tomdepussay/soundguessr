"use server"

import { QueryClient, useMutation } from "@tanstack/react-query"
import { z } from "zod"

const queryClient = new QueryClient()

const RoleSchema = z.object({
    name: z.string().min(3, "Le nom doit faire au moins 3 caractères.")
})

const updateRole = async ({ id_role, name }: {id_role: number, name: string}) => {
    
    const res = await fetch(`/api/roles/${id_role}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name
        }),
    });
    if (!res.ok) throw new Error("Échec de la mise à jour");
    return res.json();
}

const { mutate, isPending } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
});

export async function editRole(state: any, formData: any){
    
    const validationResult = RoleSchema.safeParse({
        name: formData.get("name")
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    mutate({ id_role: id_role, name: validationResult.data.name });
}
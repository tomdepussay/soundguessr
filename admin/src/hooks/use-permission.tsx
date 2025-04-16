import { useQuery } from "@tanstack/react-query";

export const usePermission = () => {
    const { data: permissions } = useQuery({
        queryKey: ["permissions"],
        staleTime: 5 * 60 * 1000, // les permissions sont valides pendant 5 minutes
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await fetch("/api/users/me/permissions", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            return await res.json();
        }
    })

    const hasPermission = (permissionName: string) => {
        return permissions?.includes(permissionName);
    }

    const hasPermissions = (permissionNames: string[]) => {
        return permissionNames.every((permissionName) => hasPermission(permissionName));
    }

    const hasAnyPermission = (permissionNames: string[]) => {
        return permissionNames.some((permissionName) => hasPermission(permissionName));
    }

    return { hasPermission, hasPermissions, hasAnyPermission };
}
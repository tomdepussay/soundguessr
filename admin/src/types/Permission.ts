import { Role } from "./Role";

export type Permission = {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    description: string | null;
    roles?: Role[];
}
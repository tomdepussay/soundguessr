import { Permission } from "./Permission";

export type Role = {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    permissions?: Permission[];
}
import { Role } from "./Role";
import { Picture } from "./Picture";

export type User = {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    username: string;
    email: string;
    password?: string;
    bio?: string
    roleId: number;
    role: Role;
    pictureId?: number;
    picture?: Picture;
};
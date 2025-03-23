export type User = {
    id_user: number;
    created_at?: Date;
    updated_at?: Date;
    username: string;
    email: string;
    password?: string;
    bio?: string
    id_role: number;
    id_picture: number | null;
};
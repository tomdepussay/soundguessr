export type Image = {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    isActive: boolean;
    link: string;
    extension: string;
    size: number;
}
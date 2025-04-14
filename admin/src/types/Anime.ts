import { Image } from './Image';

export type Anime = {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
    isActive: boolean;
    title: string;
    top100: boolean;
    imageId?: number | null;
    image?: Image;
}
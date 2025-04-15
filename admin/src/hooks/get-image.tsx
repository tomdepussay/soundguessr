"use client"

import { useQuery } from "@tanstack/react-query";
import NextImage from "next/image";
import { Skeleton } from "../components/ui/skeleton";

interface ImageProps {
    link: string;
    alt: string;
    width?: number;
    height?: number;
}

export function Image({ link, alt, width, height }: ImageProps){

    const { data, isLoading, error } = useQuery({
        queryKey: ["Image", link],
        queryFn: () => fetchImage(link)
    });

    if(isLoading) return <Skeleton className="w-full h-full" />

    return (
        <NextImage
            src={data?.file}
            alt={alt}
            className="object-contain w-full h-auto"
            width={width || 500}
            height={height || 500}
        />
    )
}

const fetchImage = async (link: string) => {
    const res = await fetch("http://localhost:3002/images/" + link);

    if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur inconnue");
    }

    let data = await res.json();
    return data;
}
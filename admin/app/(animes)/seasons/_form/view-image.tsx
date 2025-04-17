import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Anime } from "@/src/types/Anime";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Image } from "@/src/hooks/get-image";
import { Tooltip, TooltipContent, TooltipProvider } from "@/src/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface ViewImageProps {
    anime: Anime;
}

export function ViewImage({ anime }: ViewImageProps){

    const [open, setOpen] = useState(false);

    if(!anime.image) return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="destructive">
                        <ImageIcon />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <span>Image non trouvée</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <ImageIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Visualisation de l'image</DialogTitle>
                    <DialogDescription>Image de l'anime {anime.title}</DialogDescription>
                </DialogHeader>
                <div className="w-full">
                    {open && (
                        <Image 
                            link={anime.image.link}
                            alt={anime.title}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Anime } from "@/src/types/Anime";
import { useSwitchAnime } from "@/src/hooks/use-animes";

type SwitchProps = {
    anime: Anime;
}

export function Switch({ anime }: SwitchProps) {

    const { mutate, isPending } = useSwitchAnime();

    const handleClick = async () => {
        mutate({ id: anime.id });
    }

    return (
        <Button variant={anime.isActive ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                anime.isActive ? (
                    <ToggleRight />
                ) : (
                    <ToggleLeft />
                )
            }
        </Button>
    )
}
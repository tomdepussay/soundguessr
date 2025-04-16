import { Button } from "@/src/components/ui/button";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Category } from "@/src/types/Category";
import { useSwitchCategory } from "@/src/hooks/use-categories";

type SwitchProps = {
    category: Category;
}

export function Switch({ category }: SwitchProps) {

    const { mutate, isPending } = useSwitchCategory();

    const handleClick = async () => {
        mutate({ id: category.id });
    }

    return (
        <Button variant={category.isActive ? "default" : "destructive"} disabled={isPending} onClick={handleClick}>
            {
                category.isActive ? (
                    <ToggleRight />
                ) : (
                    <ToggleLeft />
                )
            }
        </Button>
    )
}
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";

export default function Filter(){
    return (
        <Button variant="outline">
            <Plus />
            Ajouter un filtre
        </Button>
    )
}
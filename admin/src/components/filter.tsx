"use client"

import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

type Field = {
    name: string;
    value: string;
}

type Filter = {
    name: string;
    operation: "contains" | "equals" | "startsWith" | "endsWith" | null;
    value: string;
}

export function useFilters() {
    const [filters, setFilters] = useState<Filter[]>([]);

    // Ajouter un filtre
    const addFilter = (name: string) => {
        setFilters((prevFilters) => {
            const existingFilter = prevFilters.find((filter) => filter.name === name);
            if (existingFilter) {
                return prevFilters.map((filter) =>
                    filter.name === name ? { name, operation: null, value: "" } : filter
                );
            }
            return [...prevFilters, { name, operation: null, value: "" }];
        });
    };

    // Supprimer un filtre
    const removeFilter = (name: string) => {
        setFilters((prevFilters) => prevFilters.filter((filter) => filter.name !== name));
    };

    // Réinitialiser tous les filtres
    const clearFilters = () => {
        setFilters([]);
    };

    return { filters, addFilter, removeFilter, clearFilters };
}

export function FilterButton({ fields, addFilter }: { fields: Field[], addFilter: (name: string) => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Plus />
                    Ajouter un filtre
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {
                        fields.map((field, index) => (
                            <DropdownMenuItem key={index} onClick={() => addFilter(field.name)}>
                                {field.name}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Filters() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-stretch items-center gap-4">
                    <p className="text-nowrap">Nom :</p>
                    <Select>
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Opération" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="1">Egal</SelectItem>
                                <SelectItem value="2">Différent</SelectItem>
                                <SelectItem value="3">Commence par</SelectItem>
                                <SelectItem value="4">Se termine par</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input className="w-1/2" />
                    <Button variant="outline">
                        <Minus />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
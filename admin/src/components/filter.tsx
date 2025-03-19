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
    operator: Operator | null;
    value: string;
}

type Operator = "contains" | "equals" | "startsWith" | "endsWith";

export function useFilters() {
    const [filters, setFilters] = useState<Filter[]>([]);

    // Ajouter un filtre
    const addFilter = (name: string) => {
        setFilters((prevFilters) => {
            const existingFilter = prevFilters.find((filter) => filter.name === name);
            if (existingFilter) {
                return prevFilters.map((filter) =>
                    filter.name === name ? { name, operator: null, value: "" } : filter
                );
            }
            return [...prevFilters, { name, operator: null, value: "" }];
        });
    };

    // Supprimer un filtre
    const removeFilter = (name: string) => {
        setFilters((prevFilters) => prevFilters.filter((filter) => filter.name !== name));
    };

    const editFilterValue = (name: string, value: string) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.name === name ? { name, operator: filter.operator, value } : filter
            )
        );
    }

    const editFilterOperator = (name: string, operator: Operator) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.name === name ? { name, operator, value: filter.value } : filter
            )
        );
    }

    // Réinitialiser tous les filtres
    const clearFilters = () => {
        setFilters([]);
    };

    return { filters, addFilter, removeFilter, editFilterValue, editFilterOperator, clearFilters };
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

type FiltersProps = {
    filters: Filter[];
    removeFilter: (name: string) => void;
    editFilterOperator: (name: string, operator: Operator) => void;
    editFilterValue: (name: string, value: string) => void;
}

export function Filters({ filters, editFilterOperator, editFilterValue, removeFilter }: FiltersProps) {

    const handleChangeSelect = (name: string, operator: string) => {
        editFilterOperator(name, operator as Operator);
    }

    const handleChangeInput = (name: string, value: string) => {
        editFilterValue(name, value);
    }

    if(filters.length === 0) return null;
    
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {
                    filters.map((filter) => (
                        <div key={filter.name}>
                            <p className="text-nowrap">{filter.name} :</p>
                            <div className="flex gap-4 w-full">
                                <Select onValueChange={(value) => handleChangeSelect(filter.name, value)}>
                                    <SelectTrigger className="w-1/2">
                                        <SelectValue placeholder="Opérateur">
                                            {filter.operator ? filter.operator : "Opérateur"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="equals">Egal</SelectItem>
                                            <SelectItem value="contains">Contient</SelectItem>
                                            <SelectItem value="startsWith">Commence par</SelectItem>
                                            <SelectItem value="endsWith">Se termine par</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input 
                                    className="w-1/2" 
                                    placeholder="Valeur" 
                                    onChange={(e) => handleChangeInput(filter.name, e.target.value)} 
                                    defaultValue={filter.value} 
                                />
                                <Button variant="outline" onClick={() => removeFilter(filter.name)}>
                                    <Minus />
                                </Button>
                            </div>
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    )
}
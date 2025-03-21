"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";

type Field = {
    id: string;
    name: string;
}
export type Filter = {
    id: string;
    name: string;
    url: string;
    operator: Operator | null;
    value: string;
}

type Operator = "contains" | "equals" | "startsWith" | "endsWith";
const operators = [
    {
        name: "Egal",
        value: "equals",
    },
    {
        name: "Contient",
        value: "contains",
    },
    {
        name: "Commence par",
        value: "startsWith",
    },
    {
        name: "Se termine par",
        value: "endsWith",
    }
];

export function useFilters(fields: Field[]) {
    const [filters, setFilters] = useState<Filter[]>([]);
    const searchParams = useSearchParams();

    const addFilter = (id: string, name: string) => {
        setFilters((prevFilters) => {
            const existingFilter = prevFilters.find((filter) => filter.id === id);
            return existingFilter
                ? prevFilters
                : [...prevFilters, { id, name, url: "", operator: null, value: "" }];
        });
    };

    const removeFilter = (id: string) => {
        setFilters((prevFilters) => prevFilters.filter((filter) => filter.id !== id));
    }

    const editFilterValue = (id: string, value: string) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id ? 
                { ...filter, value, url: makeUrl({ id: filter.id, operator: filter.operator, value }) }: 
                filter
            )
        );
    }

    const editFilterOperator = (id: string, operator: Operator) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id ? 
                { ...filter, operator, url: makeUrl({ id: filter.id, operator, value: filter.value }) }: 
                filter
            )
        );
    }

    const makeUrl = ({ id, operator, value }: { id: string, operator: Operator | null, value: string }) => {
        if(!operator || !value) return "";
        return `${id}=${operator}:${value}`;
    }

    useEffect(() => {
        fields.map((field) => {
            const url = searchParams.get(field.id);
            if(url){
                const [operator, value] = url.split(":");
                addFilter(field.id, field.name);
                editFilterOperator(field.id, operator as Operator);
                editFilterValue(field.id, value);
            }
        })
    }, []);

    return { filters, addFilter, removeFilter, editFilterValue, editFilterOperator };
}

type FilterButtonProps = {
    fields: Field[];
    addFilter: (id: string, name: string) => void;
}

export function FilterButton({ fields, addFilter }: FilterButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Plus />
                    Ajouter un filtre
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {
                        fields.map((field) => (
                            <DropdownMenuItem key={field.id} onClick={() => addFilter(field.id, field.name)}>
                                {field.name}
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

type FiltersProps = {
    filters: Filter[];
    removeFilter: (id: string) => void;
    editFilterValue: (id: string, value: string) => void;
    editFilterOperator: (id: string, operator: Operator) => void;
}

export function Filters({ filters, removeFilter, editFilterValue, editFilterOperator }: FiltersProps){
    if (filters.length === 0) return null;
    
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {
                    filters.map((filter) => (
                        <FilterRow
                            key={filter.id}
                            filter={filter}
                            removeFilter={removeFilter}
                            editFilterValue={editFilterValue}
                            editFilterOperator={editFilterOperator}
                        />
                    ))
                }
            </CardContent>
        </Card>
    )
}

type FilterProps = {
    filter: Filter;
    removeFilter: (id: string) => void;
    editFilterValue: (id: string, value: string) => void;
    editFilterOperator: (id: string, operator: Operator) => void;
}

function FilterRow({ filter, removeFilter, editFilterValue, editFilterOperator }: FilterProps) {

    const [localValue, setLocalValue] = useState(filter.value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            editFilterValue(filter.id, localValue);
        }, 300);

        return () => clearTimeout(timeout);
    }, [localValue]);
    
    return (
        <div key={filter.id}>
            <p className="text-nowrap">{filter.name} :</p>
            <div className="flex gap-4 w-full">
                <Select onValueChange={(value) => editFilterOperator(filter.id, value as Operator)} value={filter.operator || ""}>
                    <SelectTrigger className="w-1/2">
                        <SelectValue placeholder="Opérateur">
                            {
                                filter.operator ?
                                filter.operator === "equals" ? "Egal" :
                                filter.operator === "contains" ? "Contient" :
                                filter.operator === "startsWith" ? "Commence par" :
                                filter.operator === "endsWith" ? "Se termine par" : ""
                                : ""
                            }
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                operators.map((operator) => (
                                    <SelectItem key={operator.value} value={operator.value}>
                                        {operator.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input type="text" className="w-1/2" placeholder="Valeur" id="filterValue"
                    onChange={(e) => setLocalValue(e.target.value)}
                    value={localValue}
                />
                <Button variant="outline" onClick={() => removeFilter(filter.id)}>
                    <Minus />
                </Button>
            </div>
        </div>
    );
}

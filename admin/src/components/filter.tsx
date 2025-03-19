import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useCallback, useEffect } from "react";

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

    const addFilter = useCallback((name: string) => {
        setFilters((prevFilters) => {
            const existingFilter = prevFilters.find((filter) => filter.name === name);
            if (existingFilter) {
                return prevFilters.map((filter) =>
                    filter.name === name ? { name, operator: null, value: "" } : filter
                );
            }
            return [...prevFilters, { name, operator: null, value: "" }];
        });
    }, []);

    const removeFilter = useCallback((name: string) => {
        setFilters((prevFilters) => prevFilters.filter((filter) => filter.name !== name));
    }, []);

    const editFilterValue = useCallback((name: string, value: string) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.name === name ? { name, operator: filter.operator, value } : filter
            )
        );
    }, []);

    const editFilterOperator = useCallback((name: string, operator: Operator) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.name === name ? { name, operator, value: filter.value } : filter
            )
        );
    }, []);

    return { filters, addFilter, removeFilter, editFilterValue, editFilterOperator };
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
                    {fields.map((field, index) => (
                        <DropdownMenuItem key={index} onClick={() => addFilter(field.name)}>
                            {field.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function Filters({
    filters,
    removeFilter,
    editFilterValue,
    editFilterOperator
}: {
    filters: Filter[],
    removeFilter: (name: string) => void,
    editFilterValue: (name: string, value: string) => void,
    editFilterOperator: (name: string, operator: Operator) => void
}) {
    if (filters.length === 0) return null;

    const debouncedEditFilterValue = useDebounce((name: string, value: string) => {
        editFilterValue(name, value);
    }, 500);

    const handleChangeSelect = (name: string, operator: string) => {
        editFilterOperator(name, operator as Operator);
    };

    const handleChangeInput = (name: string, value: string) => {
        debouncedEditFilterValue({ name, value });
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {filters.map((filter) => (
                    <div key={filter.name}>
                        <p className="text-nowrap">{filter.name} :</p>
                        <div className="flex gap-4 w-full">
                            <Select onValueChange={(value) => handleChangeSelect(filter.name, value)} value={filter.operator || ""}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Opérateur">
                                        {filter.operator ?
                                            filter.operator === "equals" ? "Egal" :
                                                filter.operator === "contains" ? "Contient" :
                                                    filter.operator === "startsWith" ? "Commence par" :
                                                        filter.operator === "endsWith" ? "Se termine par" : ""
                                            : ""}
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
                                type="text"
                                className="w-1/2"
                                placeholder="Valeur"
                                onChange={(e) => handleChangeInput(filter.name, e.target.value)} // Déclenche le debounce
                                value={filter.value}
                            />
                            <Button variant="outline" onClick={() => removeFilter(filter.name)}>
                                <Minus />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function useDebounce(callback: Function, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState<any>(null);

    useEffect(() => {
        if (debouncedValue !== null) {
            const timer = setTimeout(() => {
                callback(debouncedValue);
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [debouncedValue, callback, delay]);

    return (value: any) => setDebouncedValue(value);
}

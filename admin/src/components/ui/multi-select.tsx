import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import { Checkbox } from "./checkbox";

interface MultiSelectProps {
    id: string;
    name: string;
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    max?: number;
}

type Option = {
    value: string;
    label: string;
}

export function MultiSelect({ id, name, options, selected, onChange, placeholder, max }: MultiSelectProps) {
    const [open, setOpen] = useState<boolean>(false);

    const handleSelect = (optionValue: string) => {
        if (selected.includes(optionValue)) {
            onChange(selected.filter((item) => item !== optionValue));
        } else {
            onChange([...selected, optionValue]);
        }
    };

    const visibleSelected = selected.slice(0, max);
    const hiddenCount = selected.length - (max ?? 0);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between h-fit hover:bg-background" name={name} id={id}>
                    {selected.length > 0 ? (
                        <div className="flex gap-1 flex-wrap items-center">
                            {visibleSelected.map((sel) => (
                                <Badge key={sel} variant="secondary">
                                    {options.find((opt) => opt.value === sel)?.label}
                                </Badge>
                            ))}
                            {hiddenCount > 0 && max && (
                                <Badge variant="secondary">+{hiddenCount} sélectionné{hiddenCount > 1 ? "s" : ""}</Badge>
                            )}
                        </div>
                    ) : (
                        <Badge variant="ghost">
                            {placeholder || "Sélectionner..."}
                        </Badge>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandEmpty>Aucun résultat.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => {
                            const isSelected = selected.includes(option.value);
                            return (
                                <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                                    <Checkbox
                                        checked={isSelected}
                                        className="border"
                                    />
                                    <span>{option.label}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
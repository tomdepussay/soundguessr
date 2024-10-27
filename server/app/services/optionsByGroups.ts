interface GroupedOptions {
    [key: string]: {
        label: string;
        options: Option[];
    };
}

interface Option {
    value: string | number;
    label: string;
}

function OptionsByGroup(query: { groupLabel: string, value: string | number, label: string }[]) {
    // Organiser le résultat
    const optionsByGroups = query.reduce((result: GroupedOptions, option) => {
        const group = option.groupLabel;

        // Si le groupLabel n'est pas encore dans l'objet résultat, on l'ajoute
        if (!result[group]) {
            result[group] = { label: group, options: [] };
        }

        // Ajouter l'option au groupLabel correspondant
        result[group].options.push({ value: option.value, label: option.label });

        return result;
    }, {});

    // Convertir en tableau si nécessaire
    return Object.values(optionsByGroups);
}

export default OptionsByGroup;
import React from "react";

interface SearchProps {
    search: string;
    setSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterMode?: string;
    setFilterMode?: (mode: string) => void;
    filterModes?: {mode: string, label: string}[];
}

function Search({ search, setSearch, filterMode, setFilterMode, filterModes }: SearchProps){
    return (
        <div className="flex gap-3 justify-center items-center flex-wrap">
            <input type="text" id="search" name="search" placeholder="Rechercher" value={search} onChange={setSearch} className="p-2 text-base md:text-lg rounded-md md:w-80 outline-none shadow-sm" autoComplete="off" />
            {
                filterMode && setFilterMode && filterModes && (
                    <select name="filter" id="filter" value={filterMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMode(e.target.value)} className="p-2 text-base md:text-lg rounded-md outline-none">
                        {
                            filterModes?.map((mode, index) => {
                                return <option key={index} value={mode.mode}>{mode.label}</option>
                            })
                        }
                    </select>
                )
            }
        </div>
    )
}

export default Search;
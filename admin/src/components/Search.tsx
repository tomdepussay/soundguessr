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
            <input type="text" id="search" name="search" placeholder="Rechercher" value={search} onChange={setSearch} className="p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner" autoComplete="off" />
            {
                filterMode && setFilterMode && filterModes && (
                    <select name="filter" id="filter" value={filterMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMode(e.target.value)} className="p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner">
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
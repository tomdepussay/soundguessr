import React from "react";
import Input from "./Input";
import Select from "./Select";

interface SearchProps {
    search: string;
    setSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterMode?: string;
    setFilterMode?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    filterModes?: Group[];
}

function Search({ search, setSearch, filterMode, setFilterMode, filterModes }: SearchProps){
    return (
        <div className="flex gap-3 justify-center items-center flex-wrap">
            <Input 
                name="search"
                type="text"
                value={search}
                setValue={setSearch}
                placeholder="Rechercher"
            />
            {
                filterMode && setFilterMode && filterModes && (
                    <Select 
                        name="filter" 
                        groups={filterModes} 
                        placeholder="Filtre" 
                        value={filterMode} 
                        setValue={setFilterMode} 
                        required 
                    />
                )
            }
            {/* <input type="text" id="search" name="search" placeholder="Rechercher" value={search} onChange={setSearch} className="p-2 rounded-lg bg-slate-900 text-white outline-none border border-slate-600/80 focus:ring focus:ring-blue-600 focus:border-blue-600" autoComplete="off" />
            {
                filterMode && setFilterMode && filterModes && (
                    <select name="filter" id="filter" value={filterMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterMode(e.target.value)} className="p-2 rounded-lg bg-slate-900 text-white outline-none focus:shadow-inner">
                        {
                            filterModes?.map((mode, index) => {
                                return <option key={index} value={mode.mode}>{mode.label}</option>
                            })
                        }
                    </select>
                )
            } */}
        </div>
    )
}

export default Search;
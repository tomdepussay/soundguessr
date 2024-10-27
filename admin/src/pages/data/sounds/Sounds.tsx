import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '@services/useFetch';
import useDebounce from '@/services/useDebounce';
import PreTable from '@components/PreTable';
import Sound from '@models/Sound';
import Table from '@components/Table';
import TableHeader from '@components/TableHeader';
import TableRow from '@components/TableRow';
import TableCell from '@components/TableCell';
import Loader from '@components/Loader';
import Button from '@components/Button';
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { DataContext } from '@/services/DataContext';
import { MdAdd } from "react-icons/md";


const FilterModes: {mode: string, label: string}[] = [
    {
        mode: "title",
        label: "Titre du son"
    },
    {
        mode: "license",
        label: "Titre de la licence"
    }
];

function Sounds() {

    const { setCurrentPage } = useContext(DataContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [filterMode, setFilterMode] = useState("none");
    const [sounds, setSounds] = useState<Sound[]>([]);
    const location = useLocation();

    const { data, isLoading } = useFetch({ name: ["sounds", { page, debouncedSearch }], 
        url: `sounds?page=${page}&search=${debouncedSearch}&filter=${filterMode}` 
    });

    useEffect(() => {
        if(data){
            setSounds(data.sounds.data);
            setTotalPages(data.sounds.meta.lastPage);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des sons",
            Buttons: [
                <Button link={"/data/sounds/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter un son
                        </span>
                    </span>
                </Button>
            ]
        });
    }, []);

    return (
        <div className="flex-1 flex flex-col overflow-x-hidden">
            <PreTable 
                search={search} 
                setSearch={(e: React.ChangeEvent<HTMLInputElement>) => {setSearch(e.target.value);}} 
                filterMode={filterMode}
                setFilterMode={setFilterMode}
                filterModes={FilterModes}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

            {
                sounds.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucun son trouvé.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableCell important>Titre</TableCell>
                            <TableCell important>Licence</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Ordre</TableCell>
                            <TableCell>Actif</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            sounds.map((sound, index) => (
                                <TableRow key={sound.id} index={index}>
                                    <TableCell important>{sound.title}</TableCell>
                                    <TableCell important border>{sound.license}</TableCell>
                                    <TableCell border>{sound.type}</TableCell>
                                    <TableCell border>{sound.order}</TableCell>
                                    <TableCell border>
                                        {
                                            sound.isActive ? (
                                                <span className="bg-green-700 p-2 py-1 rounded font-semibold">Oui</span>
                                            ) : (
                                                <span className="bg-red-700 p-2 py-1 rounded font-semibold">Non</span>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell important border>
                                        <div className="flex gap-2 justify-start items-center">
                                            <Button link={`/data/sounds/${sound.id}`} color="info">
                                                <FaEye />
                                            </Button>
                                            <Button link={`/data/sounds/edit/${sound.id}`} color='success'>
                                                <FaEdit />
                                            </Button>
                                            <Button link={`/data/sounds/delete`} color='danger'>
                                                <FaRegTrashAlt />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </Table>
                )
            }
        </div>
    )
}

export default Sounds;
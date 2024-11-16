import React, { useState, useEffect, useContext } from 'react';
import useFetch from '@services/useFetch';
import useMutation from '@/services/useMutation';
import useDebounce from '@/services/useDebounce';
import PreTable from '@components/PreTable';
import Table from '@components/Table';
import TableCaption from '@components/TableCaption';
import TableHeader from '@components/TableHeader';
import TableBody from '@components/TableBody';
import TableRow from '@components/TableRow';
import TableCell from '@components/TableCell';
import Loader from '@components/Loader';
import Button from '@components/Button';
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { DataContext } from '@/services/DataContext';
import { AlertContext } from '@services/AlertContext';
import { MdAdd } from "react-icons/md";
import toast from 'react-hot-toast';
import { IoMdSwitch } from "react-icons/io";

function Licenses() {

    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [licenses, setLicenses] = useState<License[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["licenses", { page, debouncedSearch }], 
        url: `licenses?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `licenses`,
        method: "DELETE",
        success: (data) => {
            if(data.success){
                toast.success(data.message);
                hideAlert();
                refetch();
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Erreur lors de la suppression de la licence");
            console.error("Erreur lors de la suppression de la licence", error);
        }
    })

    const mutationActive = useMutation({
        url: `licenses/active`,
        method: "PATCH",
        success: (data) => {
            if(data.success){
                hideAlert();
                toast.success(data.message);
                refetch();
            } else {
                toast.error(data.message);
            }
        },
        error: (error: any) => {
            toast.error("Erreur lors de la modification de la licence");
            console.error("Erreur lors de la modification de la licence", error);
        }
    });

    useEffect(() => {
        if(data){
            setLicenses(data.licenses.data);
            setTotalPages(data.licenses.meta.lastPage);
            setTotal(data.licenses.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des licences",
            Buttons: [
                <Button link={"/data/licenses/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter une licence
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
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />

            {
                licenses.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucune licence trouvée.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} licence(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell important>Categorie</TableCell>
                            <TableCell>Top 100</TableCell>
                            <TableCell>Actif</TableCell>
                            <TableCell>Nb sons</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            licenses.map((license, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={license.id} index={index}>
                                        <TableCell important>{license.title}</TableCell>
                                        <TableCell important border>{license.category}</TableCell>
                                        <TableCell border>
                                            {
                                                license.top100 ? (
                                                    <span className="bg-green-700 p-2 py-1 rounded font-semibold">Oui</span>
                                                ) : (
                                                    <span className="bg-red-700 p-2 py-1 rounded font-semibold">Non</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                license.isActive ? (
                                                    <span className="bg-green-700 p-2 py-1 rounded font-semibold">Oui</span>
                                                ) : (
                                                    <span className="bg-red-700 p-2 py-1 rounded font-semibold">Non</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                license.sounds_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button link={`/data/licenses/${license.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button link={`/data/licenses/edit/${license.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer la licence "${license.title}" et ses sons ?`, () => {
                                                        
                                                        mutation.mutate({ param: license.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
                                                </Button>
                                                <Button onClick={() => {
                                                    const message = license.isActive ? `Voulez-vous vraiment désactiver la licence "${license.title}" ?` : `Voulez-vous vraiment activer la licence "${license.title}" ?`;
                                                    showAlert(message, () => {
                                                        mutationActive.mutate({ param: license.id })
                                                    })
                                                }} color="warning">
                                                    <IoMdSwitch />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            ))
                        }
                    </Table>
                )
            }
        </div>
    )
}

export default Licenses;
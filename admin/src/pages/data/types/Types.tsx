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
import { AuthContext } from '@/services/AuthContext';

function Types() {

    const { hasPermission } = useContext(AuthContext);
    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [types, setTypes] = useState<Type[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["types", { page, debouncedSearch }], 
        url: `types?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `types`,
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
            toast.error("Erreur lors de la suppression du type");
            console.error("Erreur lors de la suppression du type", error);
        }
    })

    const mutationActive = useMutation({
        url: `types/active`,
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
            toast.error("Erreur lors de la modification du type");
            console.error("Erreur lors de la modification du type", error);
        }
    });

    useEffect(() => {
        if(data){
            setTypes(data.types.data);
            setTotalPages(data.types.meta.lastPage);
            setTotal(data.types.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des types",
            Buttons: [
                <Button label='Ajouter un type' visible={hasPermission("admin.data.types.add")} link={"/data/types/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter un type
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
                types.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucun type trouvé.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} type(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell>Actif</TableCell>
                            <TableCell>Nb sons</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            types.map((type, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={type.id} index={index}>
                                        <TableCell important>{type.name}</TableCell>
                                        <TableCell border>
                                            {
                                                type.isActive ? (
                                                    <span className="bg-green-700 p-2 py-1 rounded font-semibold">Oui</span>
                                                ) : (
                                                    <span className="bg-red-700 p-2 py-1 rounded font-semibold">Non</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                type.sounds_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button label='Voir les détails du type' visible={hasPermission("admin.data.types.details")} link={`/data/types/${type.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button label='Modifier le type' visible={hasPermission("admin.data.types.edit")} link={`/data/types/edit/${type.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button label='Supprimer le type' visible={hasPermission("admin.data.types.delete")} onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer le type "${type.name}" et ses sons ?`, () => {
                                                        
                                                        mutation.mutate({ param: type.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
                                                </Button>
                                                <Button label={type.isActive ? "Désactiver le type" : "Activer le type"} visible={hasPermission("admin.data.types.active")} onClick={() => {
                                                    const message = type.isActive ? `Voulez-vous vraiment désactiver le type "${type.name}" ?` : `Voulez-vous vraiment activer le type "${type.name}" ?`;
                                                    showAlert(message, () => {
                                                        mutationActive.mutate({ param: type.id })
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

export default Types;
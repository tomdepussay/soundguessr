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

function Rights() {

    const { hasPermission } = useContext(AuthContext);
    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [rights, setRights] = useState<Right[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["rights", { page, debouncedSearch }], 
        url: `rights?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `rights`,
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
            toast.error("Erreur lors de la suppression du droit");
            console.error("Erreur lors de la suppression du droit", error);
        }
    })

    useEffect(() => {
        if(data){
            setRights(data.rights.data);
            setTotalPages(data.rights.meta.lastPage);
            setTotal(data.rights.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des droits",
            Buttons: [
                <Button label='Ajouter un droit' visible={hasPermission("admin.data.rights.add")} link={"/data/rights/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter un droit
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
                rights.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucun droit trouvé.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} droit(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell important>Code</TableCell>   
                            <TableCell>Nb rôles</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            rights.map((right, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={right.id} index={index}>
                                        <TableCell important>{right.name}</TableCell>
                                        <TableCell border>{right.code}</TableCell>
                                        <TableCell border>
                                            {
                                                right.roles_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button label='Voir les détails du droit' visible={hasPermission("admin.data.rights.details")} link={`/data/rights/${right.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button label='Modifier le droit' visible={hasPermission("admin.data.rights.edit")} link={`/data/rights/edit/${right.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button label='Supprimer le droit' visible={hasPermission("admin.data.rights.delete")} onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer le droit "${right.name}" ?`, () => {
                                                        
                                                        mutation.mutate({ param: right.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
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

export default Rights;
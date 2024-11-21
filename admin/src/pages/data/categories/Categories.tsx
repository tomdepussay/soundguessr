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

function Categories() {

    const { hasPermission } = useContext(AuthContext);
    const { setCurrentPage } = useContext(DataContext);
    const { showAlert, hideAlert } = useContext(AlertContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [categories, setCategories] = useState<Category[]>([]);

    const { data, isLoading, refetch } = useFetch({ name: ["categories", { page, debouncedSearch }], 
        url: `categories?page=${page}&search=${debouncedSearch}` 
    });

    const mutation = useMutation({
        url: `categories`,
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
            toast.error("Erreur lors de la suppression de la catégorie");
            console.error("Erreur lors de la suppression de la catégorie", error);
        }
    })

    const mutationActive = useMutation({
        url: `categories/active`,
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
            toast.error("Erreur lors de la modification de la catégorie");
            console.error("Erreur lors de la modification de la catégorie", error);
        }
    });

    useEffect(() => {
        if(data){
            setCategories(data.categories.data);
            setTotalPages(data.categories.meta.lastPage);
            setTotal(data.categories.meta.total);
        }
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage({
            title: "Gestion des catégories",
            Buttons: [
                <Button label="Ajouter une catégorie" visible={hasPermission("admin.data.categories.add")} link={"/data/categories/add"} color="success">
                    <span className="text-xl flex justify-center items-center gap-2">
                        <MdAdd />
                        <span className='hidden md:block'>
                            Ajouter une catégorie
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
                categories.length === 0 && !isLoading ? (
                    <div className="flex justify-center items-center h-64 text-white font-semibold">
                        <p className="text-2xl">Aucune catégorie trouvée.</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader big />
                    </div>
                ) : (
                    <Table>
                        <TableCaption>
                            {total} catégorie(s) sur {totalPages} page(s)
                        </TableCaption>
                        <TableHeader>
                            <TableCell important>Nom</TableCell>
                            <TableCell>Actif</TableCell>
                            <TableCell>Nb licences</TableCell>
                            <TableCell important></TableCell>
                        </TableHeader>

                        {
                            categories.map((category, index) => (
                                <TableBody key={index} index={index}>
                                    <TableRow key={category.id} index={index}>
                                        <TableCell important>{category.name}</TableCell>
                                        <TableCell border>
                                            {
                                                category.isActive ? (
                                                    <span className="bg-green-700 p-2 py-1 rounded font-semibold">Oui</span>
                                                ) : (
                                                    <span className="bg-red-700 p-2 py-1 rounded font-semibold">Non</span>
                                                )
                                            }
                                        </TableCell>
                                        <TableCell border>
                                            {
                                                category.licenses_count
                                            }
                                        </TableCell>
                                        <TableCell important border>
                                            <div className="flex gap-2 justify-start items-center">
                                                <Button label="Voir les détails de la catégorie" visible={hasPermission("admin.data.categories.details")} link={`/data/categories/${category.id}`} color="info">
                                                    <FaEye />
                                                </Button>
                                                <Button label="Modifier la catégorie" visible={hasPermission("admin.data.categories.edit")} link={`/data/categories/edit/${category.id}`} color='success'>
                                                    <FaEdit />
                                                </Button>
                                                <Button label="Supprimer la catégorie" visible={hasPermission("admin.data.categories.delete")} onClick={() => {
                                                    showAlert(`Voulez-vous vraiment supprimer la catégorie "${category.name}" et ses licences ?`, () => {
                                                        
                                                        mutation.mutate({ param: category.id });
                                                    });
                                                }} color='danger'>
                                                    <FaRegTrashAlt />
                                                </Button>
                                                <Button label={category.isActive ? "Désactiver la catégorie" : "Activer la catégorie"} visible={hasPermission("admin.data.categories.active")} onClick={() => {
                                                    const message = category.isActive ? `Voulez-vous vraiment désactiver la catégorie "${category.name}" ?` : `Voulez-vous vraiment activer la catégorie "${category.name}" ?`;
                                                    showAlert(message, () => {
                                                        mutationActive.mutate({ param: category.id })
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

export default Categories;
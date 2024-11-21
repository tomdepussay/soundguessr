import React from "react";
import Button from "./Button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface PaginationProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

function Pagination({ page, setPage, totalPages }: PaginationProps){
    return (
        <div className="flex justify-center items-center gap-2">
            {
                page > 1 && (
                    <Button label="Page précédente" onClick={() => {
                        setPage(page - 1);
                    }}>
                        <FaArrowLeft />
                    </Button>
                )
            }
            <select aria-label="Choisir une page" name="pagination" id="pagination" value={page} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPage(Number(e.target.value))} className="p-2 rounded-lg bg-slate-900 shadow-md text-white outline-none focus:shadow-inner">
                {
                    Array.from(Array(totalPages).keys()).map((index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))
                }
            </select>
            {
                page < totalPages && (
                    <Button label="Page suivante" onClick={() => {
                        setPage(page + 1);
                    }}>
                        <FaArrowRight />
                    </Button>
                )
            }
        </div>
    )
}

export default Pagination;
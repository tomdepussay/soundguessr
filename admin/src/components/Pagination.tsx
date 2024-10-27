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
                    <Button onClick={() => {
                        setPage(page - 1);
                    }}>
                        <FaArrowLeft />
                    </Button>
                )
            }
            <select name="pagination" id="pagination" value={page} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPage(Number(e.target.value))} className="p-1 text-lg rounded-md outline-none">
                {
                    Array.from(Array(totalPages).keys()).map((index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))
                }
            </select>
            {
                page < totalPages && (
                    <Button onClick={() => {
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
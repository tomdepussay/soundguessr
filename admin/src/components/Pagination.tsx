import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


type PaginationProps = {
    page: number;
    setPage: (page: number) => void;
    pages: number;
}

export default function Pagination({ page, setPage, pages }: PaginationProps) {
    return (
       <div className="flex gap-2 items-center">
           <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant="outline">
               <ChevronLeft />
           </Button>
           <Select defaultValue={String(page - 1)}>
               <SelectTrigger>
                   <SelectValue placeholder="0" />
               </SelectTrigger>
               <SelectContent>
                   <SelectGroup>
                       {
                           Array.from({ length: pages }, (_, i) => (
                                <SelectItem value={String(i)} key={i} onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </SelectItem>
                           ))
                       }
                   </SelectGroup>
               </SelectContent>
           </Select>
           <Button onClick={() => setPage(page + 1)} disabled={page === pages} variant="outline">
               <ChevronRight />
           </Button>
       </div>
    )
}
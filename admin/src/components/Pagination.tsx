import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


type PaginationProps = {
    page: number;
    setPage: (page: number) => void;
    pages?: number;
}

export default function Pagination({ page, setPage, pages = 1 }: PaginationProps) {
    return (
       <div className="flex gap-2 items-center">
           <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant="outline">
               <ChevronLeft />
           </Button>
           <Select value={String(page - 1)} onValueChange={(value) => setPage(parseInt(value as string, 10) + 1)}>
               <SelectTrigger>
                   <SelectValue placeholder="0">
                        {page}
                   </SelectValue>
               </SelectTrigger>
               <SelectContent>
                   <SelectGroup>
                       {
                            pages > 0 ? (
 
                                Array.from({ length: pages }, (_, i) => (
                                        <SelectItem value={String(i)} key={i} onClick={() => setPage(i + 1)}>
                                            {i + 1}
                                        </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="0" disabled>
                                    1
                                </SelectItem>
                            )
                       }
                   </SelectGroup>
               </SelectContent>
           </Select>
           <Button onClick={() => setPage(page + 1)} disabled={page === pages || pages === 0} variant="outline">
               <ChevronRight />
           </Button>
       </div>
    )
}
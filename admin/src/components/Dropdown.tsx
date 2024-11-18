import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";


interface DropdownProps {
    link?: string;
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
}

function Dropdown({ link, title, icon, children, onClick }: DropdownProps){

    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleClick = () => {
        if(link){
            onClick && onClick();
            navigate(link);
        } else {
            setIsOpen(!isOpen);
        }
    }

    return (
        <div className="relative">
            <button onClick={handleClick} className="w-full font-semibold p-3 flex justify-start gap-2 items-center px-4 text-white text-opacity-70 hover:text-opacity-100">
                {icon}
                {title}
                {
                    !children ? null :
                    isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />
                }
            </button>
            <div className={`bg-slate-800 z-10 ${isOpen ? "block" : "hidden"}`}>
                {children}
            </div>
        </div>
    )
}

export default Dropdown;
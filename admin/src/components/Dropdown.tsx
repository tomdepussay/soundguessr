import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useLocalStorage } from "@uidotdev/usehooks";


interface DropdownProps {
    link?: string;
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    visible?: boolean;
}

function Dropdown({ link, title, icon, children, onClick, visible }: DropdownProps){

    const [isOpen, setIsOpen] = useLocalStorage(
        `dropdown-${title}`,
        children ? false : undefined
    );
    const navigate = useNavigate();

    const handleClick = () => {
        if(link){
            onClick && onClick();
            navigate(link);
        } else {
            setIsOpen(!isOpen);
        }
    }

    if(!visible) return null;

    return (
        <div className="relative">
            <button 
                aria-label={`Ouvrir le menu ${title}`}
                onClick={handleClick} 
                className="w-full font-semibold p-3 flex justify-start gap-5 items-center px-4 text-white text-opacity-70 hover:text-opacity-100"
            >
                {icon}
                {title}
                {
                    !children ? null :
                    isOpen ? <MdArrowDropUp /> : <MdArrowDropDown />
                }
            </button>
            <div className={`bg-slate-800 z-10 overflow-hidden transition-all duration-300 transform ${
                isOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
            }`}>
                {children}
            </div>
        </div>
    )
}

export default Dropdown;
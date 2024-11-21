import React from 'react';
import { Link } from 'react-router-dom';

interface DropdownItemProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    link: string;
    onClick?: () => void;
    visible?: boolean;
}

function DropdownItem({ children, icon, link, onClick, visible }: DropdownItemProps) {

    if(!visible) return null;

    return (
        <Link to={link} onClick={onClick} className="w-full p-3 pl-4 flex font-semibold justify-start gap-2 items-center px-4 text-white hover:bg-slate-700 shadow-inner">
            {icon}
            {children}
        </Link>
    )
}

export default DropdownItem;
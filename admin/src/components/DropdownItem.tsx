import React from 'react';
import { Link } from 'react-router-dom';

interface DropdownItemProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    link: string;
}

function DropdownItem({ children, icon, link }: DropdownItemProps) {
    return (
        <Link to={link} className="w-full h-14 flex justify-start gap-2 items-center px-4 text-white hover:bg-slate-700 shadow-inner">
            {icon}
            {children}
        </Link>
    )
}

export default DropdownItem;
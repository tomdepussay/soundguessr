import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";

import { MdMonitor, MdGames, MdOutlineSlideshow, MdContentCut, MdMusicNote, MdCategory, MdOutlineQuestionMark, MdCompareArrows } from "react-icons/md";
import { FaDatabase, FaUsers, FaShare } from "react-icons/fa";


function Nav(){
    return (
        <nav className="bg-slate-900 h-full w-72 flex flex-col justify-start content-start shadow-2xl">
            <div className="w-full h-14 flex justify-center gap-2 items-center px-4 text-white select-none">
                <h1 className="text-2xl text-white">SoundGuessr</h1>
            </div>

            <Dropdown link={"/"} title="Tableau de bord" icon={<MdMonitor />} />

            <Dropdown title="Gestion des données" icon={<FaDatabase />}>
                <DropdownItem link={"/data/animes"} icon={<MdOutlineSlideshow />}>
                    Animes
                </DropdownItem>
                <DropdownItem link={"/data/parts"} icon={<MdContentCut />}>
                    Parties
                </DropdownItem>
                <DropdownItem link={"/data/sounds"} icon={<MdMusicNote />}>
                    Sons
                </DropdownItem>
                <DropdownItem link={"/data/types"} icon={<MdCategory />}>
                    Types
                </DropdownItem>
                <DropdownItem link={"/data/questions"} icon={<MdOutlineQuestionMark />}>
                    Questions
                </DropdownItem>
                <DropdownItem link={"/data/networks"} icon={<FaShare />}>
                    Réseaux Sociaux
                </DropdownItem>
            </Dropdown>

            {/* <Dropdown title="Attribution" icon={<MdCompareArrows />}>
            
            </Dropdown> */}

            <Dropdown link={"/users"} title="Utilisateurs" icon={<FaUsers />} />

            <Dropdown link={"/games"} title="Parties" icon={<MdGames />} />

            <Link to={"/"} className="mt-auto mb-0 bg-slate-500 w-full h-14 flex justify-center gap-2 items-center px-4 text-slate-900 opacity-90 hover:opacity-100">
                Retour au site
            </Link>

        </nav>
    )
}

export default Nav;
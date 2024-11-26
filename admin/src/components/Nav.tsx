import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";
import { MdBalance, MdGroup, MdMonitor, MdGames, MdOutlineSlideshow, MdContentCut, MdMusicNote, MdCategory, MdOutlineQuestionMark, MdCompareArrows, MdMenu } from "react-icons/md";
import { FaDatabase, FaUsers, FaShare } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { useContext } from "react";
import { AuthContext } from "@/services/AuthContext";

interface NavProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

function Nav({ open, setOpen }: NavProps) {

    const { hasPermission } = useContext(AuthContext);
    const toggleMenu = () => setOpen(!open);
    const closeMenu = () => setOpen(false);

    return (
        <>
            {/* Barre en haut, visible uniquement sur les petits écrans */}
            <div className="bg-slate-900 sticky top-0 left-0 z-50 w-full h-14 flex justify-between items-center px-4 text-white md:hidden">
                <h1 className="text-xl font-semibold">SoundGuessr</h1>
                <button aria-label="Ouvrir le menu de navigation" onClick={toggleMenu} className="text-white">
                    <MdMenu size={24} />
                </button>
            </div>

            {/* Barre de navigation principale, masquée sur les petits écrans */}
            <nav className={`bg-slate-900 h-screen w-full flex flex-col justify-start shadow-2xl md:flex ${open ? 'block' : 'hidden'} md:w-72 md:block`}>
                <div className="w-full h-14 flex justify-center gap-2 items-center px-2 text-white select-none">
                    <h1 className="text-2xl text-white font-semibold">SoundGuessr</h1>
                </div>

                <Dropdown link={"/"} title="Tableau de bord" onClick={closeMenu} icon={<MdMonitor size={20} />} />

                <Dropdown title="Gestion des données" icon={<FaDatabase size={20} />} visible={hasPermission("admin.data")}>
                    <DropdownItem link={"/data/categories"} onClick={closeMenu} icon={<BiCategory size={20} />} visible={hasPermission("admin.data.categories")}>
                        Catégories
                    </DropdownItem>
                    <DropdownItem link={"/data/licenses"} onClick={closeMenu} icon={<MdOutlineSlideshow size={20} />} visible={hasPermission("admin.data.licenses")}>
                        Licences
                    </DropdownItem>
                    <DropdownItem link={"/data/sounds"} onClick={closeMenu} icon={<MdMusicNote size={20} />} visible={hasPermission("admin.data.sounds")}>
                        Sons
                    </DropdownItem>
                    <DropdownItem link={"/data/types"} onClick={closeMenu} icon={<MdCategory size={20} />} visible={hasPermission("admin.data.types")}>
                        Types
                    </DropdownItem>
                    <DropdownItem link={"/data/questions"} onClick={closeMenu} icon={<MdOutlineQuestionMark size={20} />} visible={hasPermission("admin.data.questions")}>
                        Questions
                    </DropdownItem>
                    <DropdownItem link={"/data/profiles"} onClick={closeMenu} icon={<MdGroup size={20} />} visible={hasPermission("admin.data.profiles")}>
                        Profils
                    </DropdownItem>
                    <DropdownItem link={"/data/rights"} onClick={closeMenu} icon={<MdBalance size={20} />} visible={hasPermission("admin.data.rights")}>
                        Droits
                    </DropdownItem>
                    <DropdownItem link={"/data/networks"} onClick={closeMenu} icon={<FaShare size={20} />} visible={hasPermission("admin.data.networks")}>
                        Réseaux Sociaux
                    </DropdownItem>
                </Dropdown>

                {/* <Dropdown title="Attribution" onClick={closeMenu} icon={<MdCompareArrows />}>

                </Dropdown> */}

                <Dropdown link={"/users"} onClick={closeMenu} title="Utilisateurs" icon={<FaUsers size={20} />} visible={hasPermission("admin.users")} />

                <Dropdown link={"/games"} onClick={closeMenu} title="Parties" icon={<MdGames size={20} />} visible={hasPermission("admin.data.games")} />

                <Link to={"/"} className="mt-auto mb-0 bg-slate-500 w-full h-14 flex justify-center gap-2 items-center px-4 text-white font-semibold opacity-90 hover:opacity-100">
                    Retour au site
                </Link>

            </nav>
        </>
    )
}

export default Nav;
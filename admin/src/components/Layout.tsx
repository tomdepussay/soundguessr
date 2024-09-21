import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function Layout(){
    return (
        <div className="w-screen h-screen flex overflow-hidden bg-slate-800 ">
            
            <Nav />

            <main className='w-screen h-screen overflow-auto overflow-x-hidden'>
                
                <Outlet />

            </main>

        </div>
    )
}

export default Layout;
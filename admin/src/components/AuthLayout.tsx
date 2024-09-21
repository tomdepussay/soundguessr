import { Outlet } from "react-router-dom";

function AuthLayout(){
    return (
        <div className="w-screen h-screen flex justify-center items-center overflow-hidden bg-slate-800">

            <div className="w-2/6 shadow-slate-700 shadow-md p-4 rounded-2xl">
                <Outlet />
            </div>
            

        </div>
    )
}

export default AuthLayout;
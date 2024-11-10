import { useMutation as useMutationReact } from "react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface MutationProps {
    url: string;
    success: (data: any) => void;
    error: (error: any) => void;
    method?: string;
}

const useMutation = ({ url, method = "GET", success, error }: MutationProps) => {

    return useMutationReact({
        mutationFn: async (variable: { body?: any, param?: any }) => {

            // Initialisation des headers
            let headers: any = {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }

            // Si le body n'est pas un FormData, on ajoute le Content-Type
            if(!(variable?.body instanceof FormData)){
                headers["Content-Type"] = "application/json; charset=utf-8";
            }

            // Initialisation du body
            let body: any = null;

            // Si le body est un FormData, on le garde tel quel, sinon on le transforme en JSON
            if(variable?.body instanceof FormData){
                body = variable?.body;
            } else {
                body = JSON.stringify(variable?.body) || null;
            }

            try {
                const response = await fetch(`${apiUrl}${url}${
                    variable?.param ? `/${variable.param}` : ""
                }`, {
                    method: method,
                    headers,
                    body
                });
                return response.json();
            } catch (err) {
                console.error("Fetch error:", err);
                throw err;
            }
        },
        onSuccess: success,
        onError: error
    });
}

export default useMutation;
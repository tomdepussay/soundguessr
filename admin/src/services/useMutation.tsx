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
            try {
                const response = await fetch(`${apiUrl}${url}${
                    variable?.param ? `/${variable.param}` : ""
                }`, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(variable?.body) || null
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
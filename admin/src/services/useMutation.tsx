import { useMutation as useMutationReact } from "react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface MutationProps {
    url: string;
    success: (data: any) => void;
    error: (error: any) => void;
    options: OptionProps;
}

interface OptionProps {
    method: string;
    body: any;
}

const useMutation = ({ url, options, success, error }: MutationProps) => {
    return useMutationReact({
        mutationFn: async () => {
            const response = await fetch(`${apiUrl}${url}`, {
                method: options.method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(options.body)
            });
            return response.json();
        },
        onSuccess: success,
        onError: error
    });
}

export default useMutation;
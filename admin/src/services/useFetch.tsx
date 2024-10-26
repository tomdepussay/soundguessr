import React from "react";
import { useQuery } from "react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface FetchProps {
    name: string;
    url: string;
    options?: OptionProps;
}

interface OptionProps {
    method: string;
    body: any;
}

const useFetch = ({ name, url, options}: FetchProps) => {
    return useQuery(name, async () => {
        const response = await fetch(`${apiUrl}${url}`, {
          method: options?.method || "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }, 
          body: JSON.stringify(options?.body) || null
        })
        return response.json();
    })
}

export default useFetch;
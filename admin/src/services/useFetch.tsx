import React from "react";
import { useQuery } from "react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface FetchProps {
  name: string | [string, any];
  url: string;
  options?: OptionProps;
}

interface OptionProps {
  method?: string;
  body?: any;
}

const useFetch = ({ name, url, options }: FetchProps) => {
  return useQuery(name, async () => {
    try {
      const response = await fetch(`${apiUrl}${url}`, {
        method: options?.method || "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ''}`, // Default to empty string if token is null
        },
        body: options?.body ? JSON.stringify(options.body) : null // Handle body as optional
      })
      return response.json();
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  })
}

export default useFetch;
import React from "react";
import { useQuery } from "react-query";

const apiUrl = import.meta.env.VITE_API_URL;

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 
    headers?: Record<string, string>; 
    body?: any; 
  }

const useFetch = (url: string, options: FetchOptions = {} ) => {

    const fetcher = async () => {
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: options.headers || { 'Content-Type': 'application/json' },
          body: options.body ? JSON.stringify(options.body) : undefined,
          ...options
        });
        
        return response.json();
      };

    return useQuery([url, options], fetcher);

}

export default useFetch;
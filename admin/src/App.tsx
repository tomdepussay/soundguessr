import Router from "@services/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "@/services/AuthContext";
import { AlertProvider } from "@/services/AlertContext";

const queryClient = new QueryClient();

function App(){

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AlertProvider>
                    <Router />
                    <ReactQueryDevtools initialIsOpen={false} />
                </AlertProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App;
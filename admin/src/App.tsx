import Router from "@services/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "@/services/AuthContext";

const queryClient = new QueryClient();

function App(){

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Router />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App;
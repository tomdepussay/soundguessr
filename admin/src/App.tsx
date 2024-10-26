import Router from "@services/Router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "@/services/AuthContext";

const queryClient = new QueryClient();

function App(){

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router />
                <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App;
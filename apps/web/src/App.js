import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
export function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs(BrowserRouter, { children: [_jsx(AppRoutes, {}), _jsx(Toaster, { position: "top-right", richColors: true, closeButton: true, toastOptions: {
                        style: {
                            borderRadius: '1rem',
                        },
                    } })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map
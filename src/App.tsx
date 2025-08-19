// src/App.tsx

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// --- Lazy Loading de Páginas ---
// Al usar 'export default' en cada página, la importación es más limpia.
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const LoginPage = lazy(() => import("./components/auth/LoginPage"));
const ClientLayout = lazy(() => import("./components/client/ClientLayout"));
const ClientDashboard = lazy(() => import("./components/client/ClientDashboard"));
const ClientBookings = lazy(() => import("./components/client/ClientBookings"));

const queryClient = new QueryClient();

// Componente de carga para Suspense
const SuspenseLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<SuspenseLoader />}>
          <Routes>
            {/* Redirección de la raíz a la página de login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback/google" element={<GoogleCallback />} />
            
            {/* Ruta del Panel de Administración */}
            <Route path="/admin" element={<Index />} />
            
            {/* Rutas Protegidas para el Cliente */}
            <Route path="/app" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="bookings" element={<ClientBookings />} />
            </Route>

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import Index from "./pages/Index";
import Downloads from "./pages/Downloads";
import History from "./pages/History";
import Network from "./pages/Network";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route
        path="/downloads"
        element={
          <MainLayout>
            <Downloads />
          </MainLayout>
        }
      />
      <Route
        path="/history"
        element={
          <MainLayout>
            <History />
          </MainLayout>
        }
      />
      <Route
        path="/network"
        element={
          <MainLayout>
            <Network />
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    future: { v7_startTransition: true, v7_relativeSplatPath: true },
  }
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

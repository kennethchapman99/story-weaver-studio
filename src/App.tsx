import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Packages from "./pages/Packages.tsx";
import OrderTypeSelector from "./pages/create/OrderTypeSelector.tsx";
import Wizard from "./pages/create/Wizard.tsx";
import DetailedForm from "./pages/create/DetailedForm.tsx";
import Checkout from "./pages/Checkout.tsx";
import Success from "./pages/Success.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import OrderDetail from "./pages/dashboard/OrderDetail.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/create" element={<OrderTypeSelector />} />
          <Route path="/create/wizard" element={<Wizard />} />
          <Route path="/create/form" element={<DetailedForm />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<OrderDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

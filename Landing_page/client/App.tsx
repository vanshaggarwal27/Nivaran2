import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import TechStack from "./pages/TechStack";
import StartSnapping from "./pages/StartSnapping";
import { Layout } from "@/components/site/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="about-us" element={<Placeholder title="About Us" />} />
            <Route path="snappers" element={<Placeholder title="Nivcrew" />} />
            <Route path="solvers" element={<Placeholder title="Nivsewaks" />} />
            <Route
              path="help-centre"
              element={<Placeholder title="Help Centre" />}
            />
            <Route path="send" element={<Placeholder title="Send a Snap" />} />
            <Route path="start-snapping" element={<StartSnapping />} />
            <Route path="techstack" element={<TechStack />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

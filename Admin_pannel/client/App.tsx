import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AdminPanelLoader } from "./components/ui/admin-panel-loader";

// Lazy load heavy components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Issues = lazy(() => import("./pages/Issues"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Settings = lazy(() => import("./pages/Settings"));
const AppShell = lazy(() => import("./components/layout/AppShell"));
const SupervisorDashboard = lazy(() => import("./pages/supervisor/Dashboard"));
const SupervisorIssues = lazy(() => import("./pages/supervisor/Issues"));
const SupervisorIssueDetail = lazy(() => import("./pages/supervisor/IssueDetail"));
const SupervisorAnalytics = lazy(() => import("./pages/supervisor/Analytics"));
const Notifications = lazy(() => import("./pages/Notifications"));

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Suspense fallback={<AdminPanelLoader />}>
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Index />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/supervisor"
                element={
                  <RequireAuth>
                    <AppShell>
                      <SupervisorDashboard />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/issues"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Issues />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/supervisor/issues"
                element={
                  <RequireAuth>
                    <AppShell>
                      <SupervisorIssues />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/supervisor/issues/:id"
                element={
                  <RequireAuth>
                    <AppShell>
                      <SupervisorIssueDetail />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/analytics"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Analytics />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/supervisor/analytics"
                element={
                  <RequireAuth>
                    <AppShell>
                      <SupervisorAnalytics />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Leaderboard />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Settings />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route
                path="/notifications"
                element={
                  <RequireAuth>
                    <AppShell>
                      <Notifications />
                    </AppShell>
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

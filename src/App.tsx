import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import Home from "./pages/Home";
import Team from "./pages/Team";
import EvaluationList from "./pages/EvaluationList";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";
import MemberDetail from "./pages/MemberDetail";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLider from "./pages/DashboardLider";
import DashboardLiderado from "./pages/DashboardLiderado";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota raiz redireciona para Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboards protegidos com RBAC */}
            <Route 
              path="/dashboard-lider" 
              element={
                <ProtectedRoute allowedRole="lider">
                  <DashboardLider />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard-liderado" 
              element={
                <ProtectedRoute allowedRole="liderado">
                  <DashboardLiderado />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas antigas do dashboard (manter compatibilidade) */}
            <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
            <Route path="/team" element={<DashboardLayout><Team /></DashboardLayout>} />
            <Route path="/team/:memberId" element={<DashboardLayout><MemberDetail /></DashboardLayout>} />
            <Route path="/compare" element={<DashboardLayout><Compare /></DashboardLayout>} />
            <Route path="/evaluation" element={<DashboardLayout><EvaluationList /></DashboardLayout>} />
            <Route path="/evaluation/:memberId" element={<DashboardLayout><Evaluation /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

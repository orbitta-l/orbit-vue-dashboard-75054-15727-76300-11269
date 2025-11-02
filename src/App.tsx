import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import DashboardLiderado from "./pages/DashboardLiderado";

const queryClient = new QueryClient();

const LiderDashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute allowedRole="LIDER">
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
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
              element={<LiderDashboardWrapper><Home /></LiderDashboardWrapper>} 
            />
            <Route 
              path="/dashboard-liderado" 
              element={
                <ProtectedRoute allowedRole="LIDERADO">
                  <DashboardLiderado />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas antigas do dashboard (agora protegidas) */}
            <Route path="/home" element={<LiderDashboardWrapper><Home /></LiderDashboardWrapper>} />
            <Route path="/team" element={<LiderDashboardWrapper><Team /></LiderDashboardWrapper>} />
            <Route path="/team/:memberId" element={<LiderDashboardWrapper><MemberDetail /></LiderDashboardWrapper>} />
            <Route path="/compare" element={<LiderDashboardWrapper><Compare /></LiderDashboardWrapper>} />
            <Route path="/evaluation" element={<LiderDashboardWrapper><EvaluationList /></LiderDashboardWrapper>} />
            <Route path="/evaluation/:memberId" element={<LiderDashboardWrapper><Evaluation /></LiderDashboardWrapper>} />
            <Route path="/settings" element={<LiderDashboardWrapper><Settings /></LiderDashboardWrapper>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
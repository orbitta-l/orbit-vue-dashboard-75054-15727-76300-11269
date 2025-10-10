import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - Dashboard */}
          <Route path="/" element={<DashboardLayout><Home /></DashboardLayout>} />
          <Route path="/team" element={<DashboardLayout><Team /></DashboardLayout>} />
          <Route path="/team/:memberId" element={<DashboardLayout><MemberDetail /></DashboardLayout>} />
          <Route path="/compare" element={<DashboardLayout><Compare /></DashboardLayout>} />
          <Route path="/evaluation" element={<DashboardLayout><EvaluationList /></DashboardLayout>} />
          <Route path="/evaluation/:memberId" element={<DashboardLayout><Evaluation /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CareerAdvice from "./pages/CareerAdvice";
import SkillAssessment from "./pages/SkillAssessment";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPrep from "./pages/InterviewPrep";
import CareerRoadmap from "./pages/CareerRoadmap";
import SalaryInsights from "./pages/SalaryInsights";
import SavedCareers from "./pages/SavedCareers";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="career-advice" element={<CareerAdvice />} />
              <Route path="skill-assessment" element={<SkillAssessment />} />
              <Route path="resume-builder" element={<ResumeBuilder />} />
              <Route path="interview-prep" element={<InterviewPrep />} />
              <Route path="career-roadmap" element={<CareerRoadmap />} />
              <Route path="salary-insights" element={<SalaryInsights />} />
              <Route path="saved-careers" element={<SavedCareers />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

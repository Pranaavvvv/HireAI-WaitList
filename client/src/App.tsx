import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Waitlist from "./pages/Waitlist";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DevelopmentProcess from "./pages/DevelopmentProcess";
import TechDetails from "./pages/TechDetails";
import WorkwearProject from "./pages/WorkwearProject";
import SportRetailProject from "./pages/SportRetailProject";
import PetProject from "./pages/PetProject";
import HockeyProject from "./pages/HockeyProject";
import FireCatProject from "./pages/FireCatProject";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/development-process" element={<DevelopmentProcess />} />
            <Route path="/tech-details" element={<TechDetails />} />
            <Route path="/projects/workwear" element={<WorkwearProject />} />
            <Route path="/projects/sport-retail" element={<SportRetailProject />} />
            <Route path="/projects/pet" element={<PetProject />} />
            <Route path="/projects/hockey" element={<HockeyProject />} />
            <Route path="/projects/firecat" element={<FireCatProject />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

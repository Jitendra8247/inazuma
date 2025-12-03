// Main App component with routing and providers

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/AuthContext";
import { TournamentProvider } from "@/context/TournamentContext";
import { WalletProvider } from "@/context/WalletContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import TournamentDetails from "./pages/TournamentDetails";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Wallet from "./pages/Wallet";
import AdminWallets from "./pages/AdminWallets";
import AdminPlayers from "./pages/AdminPlayers";
import MyTournaments from "./pages/MyTournaments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          <TournamentProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route path="/tournaments/:id" element={<TournamentDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route path="/register/:id" element={
                      <ProtectedRoute>
                        <Registration />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute requiredRole="organizer">
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/wallet" element={
                      <ProtectedRoute>
                        <Wallet />
                      </ProtectedRoute>
                    } />
                    <Route path="/my-tournaments" element={
                      <ProtectedRoute>
                        <MyTournaments />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/wallets" element={
                      <ProtectedRoute requiredRole="organizer">
                        <AdminWallets />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/players" element={
                      <ProtectedRoute requiredRole="organizer">
                        <AdminPlayers />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </div>
              </BrowserRouter>
            </TooltipProvider>
          </TournamentProvider>
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

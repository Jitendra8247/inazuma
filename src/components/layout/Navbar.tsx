// Navbar component - Sticky responsive navigation with auth buttons

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, User, LogOut, LayoutDashboard, Trophy, Wallet, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Tournaments', path: '/tournaments' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className="h-8 w-8 text-primary transition-all duration-300 group-hover:text-neon-magenta" />
              <div className="absolute inset-0 blur-lg bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider neon-text-cyan">
              INAZUMA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-display text-sm tracking-wide transition-all duration-200 relative",
                  location.pathname === link.path
                    ? "text-primary neon-text-cyan"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    style={{ boxShadow: '0 0 10px hsl(var(--primary))' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'organizer' && (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/players">
                        <Users className="h-4 w-4 mr-2" />
                        Players
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/wallets">
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallets
                      </Link>
                    </Button>
                  </>
                )}
                {user?.role === 'player' && (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/my-tournaments">
                        <Trophy className="h-4 w-4 mr-2" />
                        My Tournaments
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/wallet">
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallet
                      </Link>
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    {user?.username}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="neon" size="sm" asChild>
                  <Link to="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block py-2 font-display text-sm tracking-wide transition-colors",
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-border/50 pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'organizer' && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/players"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground"
                        >
                          <Users className="h-4 w-4" />
                          Players
                        </Link>
                        <Link
                          to="/admin/wallets"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground"
                        >
                          <Wallet className="h-4 w-4" />
                          Manage Wallets
                        </Link>
                      </>
                    )}
                    {user?.role === 'player' && (
                      <>
                        <Link
                          to="/my-tournaments"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground"
                        >
                          <Trophy className="h-4 w-4" />
                          My Tournaments
                        </Link>
                        <Link
                          to="/wallet"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 py-2 text-muted-foreground"
                        >
                          <Wallet className="h-4 w-4" />
                          My Wallet
                        </Link>
                      </>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-muted-foreground"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-2 text-destructive w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button variant="neon" asChild className="w-full">
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Trophy className="h-4 w-4 mr-2" />
                        Join Now
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

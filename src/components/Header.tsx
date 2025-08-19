import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data?.full_name) {
          setUserFullName(data.full_name);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const displayName = userFullName || user?.email || 'User';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/01647e5b-34d9-4ffe-bcff-4f0a02b28ead.png" 
              alt="GreenIntellect Logo" 
              className="h-20 w-20 object-contain" 
            />
            <span className="text-xl font-bold text-gray-900">GreenIntellect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link to="/analytics" className="text-gray-700 hover:text-green-600 transition-colors">
              Analytics
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                Admin
              </Link>
            )}
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Welcome, {displayName}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1" 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/analytics" 
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1" 
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1" 
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-sm text-gray-600 px-2 mb-2">
                    {displayName}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="mx-2"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 flex space-x-2 px-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, MessageCircle, Calendar, Trophy, Menu, X, LogOut, Brain } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const navItems = [
    { to: '/', label: 'Painel', icon: BarChart3 },
    { to: '/runs', label: 'Minhas Corridas', icon: Trophy },
    { to: '/plan', label: 'Plano Inteligente', icon: Brain },
    { to: '/chat', label: 'Chat com o Kai', icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const NavItems = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-105'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800 border-r border-gray-700">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🐆</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">KaiTrainer</h1>
                  <p className="text-xs text-gray-400">Seu coach de corrida</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 px-4 space-y-2">
              <NavItems />
            </nav>

            {/* Bottom Section */}
            <div className="px-4 py-4 border-t border-gray-700">
              <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {profile?.full_name || user?.email || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-400">Corredor</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🐆</span>
            </div>
            <h1 className="text-lg font-bold text-white">KaiTrainer</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-b border-gray-700">
            <nav className="px-4 py-4 space-y-2">
              <NavItems />
              <div className="pt-4 border-t border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <LogOut size={16} className="mr-2" />
                  Sair
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

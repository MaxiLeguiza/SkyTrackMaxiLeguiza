import React, { useState } from 'react';
import { Plane, Home, Users, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Home },
    { id: 'flights', label: 'Vuelos', icon: Plane },
    { id: 'planes', label: 'Aviones', icon: Plane },
    { id: 'crew', label: 'Tripulación', icon: Users },
  ];

  const MenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <button
      onClick={() => {
        onViewChange(item.id);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
        currentView === item.id
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <item.icon className="w-5 h-5" />
      <span className="hidden sm:inline">{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">SkyTrack Airlines</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Sistema de Gestión</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-600">{user?.username}</span>
                <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Salir</span>
              </Button>
            </div>
          </div>

          {/* Navigation horizontal - Desktop */}
          <nav className="hidden lg:flex gap-2 overflow-x-auto">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </nav>
        </div>

        {/* Navigation Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 p-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
              <p className="font-semibold mb-1">Usuario actual</p>
              <p className="text-gray-600">{user?.username}</p>
              <Badge className="mt-2" variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                {user?.role}
              </Badge>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Full Width */}
      <main className="p-4 lg:p-8">{children}</main>
    </div>
  );
};
// src/pages/ClientLayout.tsx

import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Links de navegación para el cliente
const clientNavItems = [
  { href: '/app', label: 'Mi Dashboard', icon: LayoutDashboard },
  { href: '/app/bookings', label: 'Reservar Clase', icon: CalendarPlus },
];

export default function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="p-4 bg-background border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Iron Wolf</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Cerrar Sesión <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </header>

      {/* Barra de Navegación del Cliente */}
      <nav className="p-2 bg-background border-b">
        <div className="flex items-center justify-center space-x-2">
            {clientNavItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                    <Link to={item.href} key={item.label}>
                        <Button variant={isActive ? 'default' : 'ghost'} className="h-9">
                           <item.icon className="mr-2 h-4 w-4" /> {item.label}
                        </Button>
                    </Link>
                );
            })}
        </div>
      </nav>
      
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}
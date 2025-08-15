// src/pages/ClientLayout.tsx

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function ClientLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="p-4 bg-background border-b flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Iron Wolf</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Cerrar Sesión
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </header>
      <main>
        {/* Aquí se renderizarán las páginas anidadas como el ClientDashboard */}
        <Outlet /> 
      </main>
    </div>
  );
}
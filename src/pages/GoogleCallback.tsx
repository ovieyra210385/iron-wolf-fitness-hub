// src/pages/GoogleCallback.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

// Esta página no muestra casi nada, solo procesa la redirección y se va.
export default function GoogleCallback() {
  const [message, setMessage] = useState('Procesando autorización...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processCode = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      
      if (!code) {
        setMessage('Error: No se recibió el código de autorización.');
        return;
      }

      // Obtenemos el ID del socio que inició el proceso
      const { data: { session } } = await supabase.auth.getSession();
      const memberId = session?.user?.id;

      if (!memberId) {
        setMessage('Error: No se pudo verificar tu identidad. Por favor, inicia sesión de nuevo.');
        return;
      }
      
      try {
        // Get auth token for secure request
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token;

        if (!authToken) {
          throw new Error('No se pudo obtener el token de autenticación');
        }

        // Send secure request with auth token
        const response = await fetch('http://localhost:3000/integrations/google/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ code, memberId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error en el servidor.');
        }

        setMessage('¡Conexión exitosa! Redirigiendo...');
        
        // Redirigimos al usuario a la página de configuración después de 2 segundos
        setTimeout(() => {
          navigate('/'); // O a la ruta de tu página de configuración, ej: '/settings'
        }, 2000);

      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };
    
    processCode();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <Loader2 className="h-12 w-12 animate-spin mb-4" />
      <h1 className="text-xl font-medium">{message}</h1>
    </div>
  );
}
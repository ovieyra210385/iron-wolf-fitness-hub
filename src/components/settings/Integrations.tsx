// src/components/settings/Integrations.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Activity, CheckCircle, Zap } from "lucide-react";

// Función para obtener el ID de usuario de la sesión actual de Supabase
const getMemberId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id;
};

export function Integrations() {
  const [googleFitConnected, setGoogleFitConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const memberId = await getMemberId();
      if (!memberId) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('member_integrations')
        .select('provider')
        .eq('member_id', memberId)
        .eq('provider', 'google_fit')
        .single(); // Solo nos interesa saber si existe o no

      setGoogleFitConnected(!!data); // Si hay datos, está conectado
      setLoading(false);
    };
    checkConnection();
  }, []);
  
  const handleConnectGoogleFit = () => {
    // Estas variables deben coincidir EXACTAMENTE con lo que configuraste en Google Cloud
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // ¡Importante! Lo configuraremos después
    const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const SCOPES = [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
    ].join(' ');

    // Construimos la URL de autorización de Google
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;

    // Redirigimos al usuario a la página de Google
    window.location.href = authUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integraciones</CardTitle>
        <CardDescription>Conecta tus aplicaciones de salud para sincronizar tu actividad.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center">
            <Activity className="h-6 w-6 mr-3 text-primary" />
            <div>
              <p className="font-medium">Google Fit</p>
              <p className="text-sm text-muted-foreground">Sincroniza tus entrenamientos y datos de salud.</p>
            </div>
          </div>
          {loading ? <Button disabled>Verificando...</Button> :
           googleFitConnected ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Conectado</span>
            </div>
           ) : (
            <Button onClick={handleConnectGoogleFit}>
              <Zap className="mr-2 h-4 w-4" />
              Conectar
            </Button>
           )
          }
        </div>
      </CardContent>
    </Card>
  );
}
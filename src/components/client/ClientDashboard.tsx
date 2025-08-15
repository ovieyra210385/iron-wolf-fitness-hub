// src/components/client/ClientDashboard.tsx

import React, { useState, useEffect } from 'react'; // <-- Asegúrate de importar useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // <-- Importa el botón
import { supabase } from "@/lib/supabaseClient";
import { Dumbbell, Utensils, Loader2, ArrowRight } from "lucide-react";
import { ClientTrainingPlanDetails } from './ClientTrainingPlanDetails'; // <-- Importa la nueva vista

// El hook personalizado `useMemberData` se mantiene exactamente igual
const useMemberData = () => {
    // ... (código sin cambios)
};

export function ClientDashboard() {
  const { loading, memberPlans, error } = useMemberData();
  
  // --- NUEVO ESTADO PARA GESTIONAR LA VISTA ---
  const [activeView, setActiveView] = useState<'dashboard' | 'training_details'>('dashboard');

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }
  
  // --- RENDERIZADO CONDICIONAL ---
  // Si la vista activa es 'training_details', muestra ese componente
  if (activeView === 'training_details' && memberPlans?.training_plan) {
    return <ClientTrainingPlanDetails plan={memberPlans.training_plan} onBack={() => setActiveView('dashboard')} />;
  }

  // Si no, muestra el dashboard principal
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-heading font-bold">Bienvenido a Iron Wolf</h1>
      <p className="text-muted-foreground">Aquí tienes un resumen de tus planes y actividad. ¡A darlo todo!</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Plan de Entrenamiento</CardTitle>
              <CardDescription>Tu rutina asignada.</CardDescription>
            </div>
            <Dumbbell className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {memberPlans?.training_plan ? (
              <div>
                <h3 className="font-bold text-lg text-primary">{memberPlans.training_plan.name}</h3>
                <p className="text-muted-foreground mt-1">{memberPlans.training_plan.description}</p>
                {/* --- BOTÓN PARA VER DETALLES --- */}
                <Button className="mt-4" onClick={() => setActiveView('training_details')}>
                  Ver mi Rutina <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Aún no tienes un plan de entrenamiento asignado. ¡Pídeselo a tu entrenador!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          {/* ... Tarjeta de Plan de Nutrición (sin cambios por ahora) ... */}
        </Card>
      </div>
    </div>
  );
}
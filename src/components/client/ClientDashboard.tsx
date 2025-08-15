// src/components/client/ClientDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Dumbbell, Utensils, Loader2, ArrowRight } from "lucide-react";
import { ClientTrainingPlanDetails } from './ClientTrainingPlanDetails';
import { ClientNutritionPlanDetails } from './ClientNutritionPlanDetails'; // <-- 1. Importa la nueva vista

// Hook para obtener los planes del miembro autenticado
const useMemberData = () => {
  const [loading, setLoading] = useState(true);
  const [memberPlans, setMemberPlans] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        // Aquí deberías obtener el usuario autenticado y luego sus planes
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("No hay usuario autenticado");
          setLoading(false);
          return;
        }
        // Supón que tienes una tabla 'member_plans' relacionada al user.id
        const { data, error } = await supabase
          .from('member_plans')
          .select('training_plan:training_plan_id(*), nutrition_plan:nutrition_plan_id(*)')
          .eq('user_id', user.id)
          .single();
        if (error) {
          setError(error.message);
        } else {
          setMemberPlans(data);
        }
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  return { loading, memberPlans, error };
};

export function ClientDashboard() {
  const { loading, memberPlans, error } = useMemberData();
  
  // --- 2. El estado ahora gestiona tres vistas ---
  const [activeView, setActiveView] = useState<'dashboard' | 'training_details' | 'nutrition_details'>('dashboard');

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }
  
  // --- 3. Lógica de renderizado expandida ---
  if (activeView === 'training_details' && memberPlans?.training_plan) {
    return <ClientTrainingPlanDetails plan={memberPlans.training_plan} onBack={() => setActiveView('dashboard')} />;
  }
  if (activeView === 'nutrition_details' && memberPlans?.nutrition_plan) {
    return <ClientNutritionPlanDetails plan={memberPlans.nutrition_plan} onBack={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-heading font-bold">Bienvenido a Iron Wolf</h1>
      <p className="text-muted-foreground">Aquí tienes un resumen de tus planes y actividad. ¡A darlo todo!</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          {/* ... Tarjeta de Entrenamiento (sin cambios) ... */}
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Plan de Nutrición</CardTitle>
              <CardDescription>Tu dieta recomendada.</CardDescription>
            </div>
            <Utensils className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {memberPlans?.nutrition_plan ? (
              <div>
                <h3 className="font-bold text-lg text-green-500">{memberPlans.nutrition_plan.name}</h3>
                <p className="text-muted-foreground mt-1">{memberPlans.nutrition_plan.calories} kcal aproximadas</p>
                {/* --- 4. Botón activado para ver detalles --- */}
                <Button variant="outline" className="mt-4" onClick={() => setActiveView('nutrition_details')}>
                  Ver mi Dieta <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Aún no tienes un plan de nutrición asignado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// export { ClientDashboard }; // Eliminado para evitar doble exportación
// src/components/client/ClientTrainingPlanDetails.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Loader2, Repeat, Dumbbell, Clock } from "lucide-react";

interface ClientTrainingPlanDetailsProps {
  plan: { id: string; name: string; description: string };
  onBack: () => void; // Función para volver al dashboard
}

export function ClientTrainingPlanDetails({ plan, onBack }: ClientTrainingPlanDetailsProps) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!plan.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('plan_exercises')
        .select(`
          sets,
          reps,
          rest_period,
          exercises ( name, description, video_url )
        `)
        .eq('plan_id', plan.id);

      if (error) {
        console.error("Error fetching exercises:", error);
      } else {
        setExercises(data || []);
      }
      setLoading(false);
    };
    fetchExercises();
  }, [plan.id]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a mi Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : exercises.length > 0 ? (
            exercises.map((ex, index) => (
              <Card key={index} className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Dumbbell className="mr-3 h-5 w-5 text-primary" />
                    {ex.exercises.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background">
                    <p className="font-bold text-xl">{ex.sets}</p>
                    <p className="text-sm text-muted-foreground">Series</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background">
                    <p className="font-bold text-xl">{ex.reps}</p>
                    <p className="text-sm text-muted-foreground">Repeticiones</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-background col-span-2 md:col-span-1">
                    <p className="font-bold text-xl">{ex.rest_period || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Descanso</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Este plan aún no tiene ejercicios asignados.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
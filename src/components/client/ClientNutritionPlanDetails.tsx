// src/components/client/ClientNutritionPlanDetails.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Loader2, Soup } from "lucide-react";

interface ClientNutritionPlanDetailsProps {
  plan: { id: string; name: string; calories: number };
  onBack: () => void;
}

export function ClientNutritionPlanDetails({ plan, onBack }: ClientNutritionPlanDetailsProps) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!plan.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('nutrition_plan_meals')
        .select(`
          meal_type,
          quantity,
          meals ( name, calories )
        `)
        .eq('plan_id', plan.id)
        .order('created_at'); // Podríamos ordenar por un campo de hora en el futuro

      if (error) {
        console.error("Error fetching meals:", error);
      } else {
        // Agrupamos las comidas por tipo (Desayuno, Almuerzo, etc.)
        const groupedMeals = (data || []).reduce((acc, meal) => {
            const type = meal.meal_type || 'General';
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(meal);
            return acc;
        }, {});
        setMeals(groupedMeals);
      }
      setLoading(false);
    };
    fetchMeals();
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
          <CardDescription>Total aproximado: {plan.calories} kcal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
          ) : Object.keys(meals).length > 0 ? (
            Object.entries(meals).map(([mealType, mealItems]) => (
              <div key={mealType}>
                <h3 className="font-bold text-lg mb-2"><Badge variant="secondary">{mealType}</Badge></h3>
                <div className="space-y-2">
                  {(mealItems as any[]).map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/40">
                      <div className="flex items-center">
                        <Soup className="h-5 w-5 mr-3 text-green-500" />
                        <div>
                          <p className="font-medium">{item.meals.name}</p>
                          <p className="text-sm text-muted-foreground">{item.quantity}</p>
                        </div>
                      </div>
                      {item.meals.calories && <p className="font-semibold">{item.meals.calories} kcal</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Este plan aún no tiene comidas asignadas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
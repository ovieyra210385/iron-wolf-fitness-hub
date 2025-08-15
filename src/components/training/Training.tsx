// src/components/training/Training.tsx

import React, { useState, useEffect, useCallback } from 'react';
// ... (todas las importaciones se mantienen igual)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Dumbbell, Utensils, Edit, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { PlanDetails } from './PlanDetails'; 
import { AssignPlanModal } from './AssignPlanModal';
import { NutritionPlanDetails } from './NutritionPlanDetails';

const initialTrainingPlanState = { name: "", description: "" };
const initialNutritionPlanState = { name: "", description: "", calories: "" };

export function Training() {
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeView, setActiveView] = useState<{ type: 'list' | 'training_details' | 'nutrition_details', data: any }>({ type: 'list', data: null });
  const [modal, setModal] = useState<'closed' | 'new_training' | 'new_nutrition' | 'assign_plan'>('closed');
  const [planToAssign, setPlanToAssign] = useState<{plan: any, type: 'training' | 'nutrition' | null}>({plan: null, type: null});

  const [newTrainingPlan, setNewTrainingPlan] = useState(initialTrainingPlanState);
  const [newNutritionPlan, setNewNutritionPlan] = useState(initialNutritionPlanState);
  // ... (el resto de los estados y funciones se mantienen exactamente igual)
  const [isSaving, setIsSaving] = useState(false);

  const fetchPlans = useCallback(async () => { /* ... sin cambios ... */ }, []);
  useEffect(() => { fetchPlans(); }, [fetchPlans]);
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { /* ... sin cambios ... */ };
  const handleSaveTrainingPlan = async () => { /* ... sin cambios ... */ };
  const handleSaveNutritionPlan = async () => { /* ... sin cambios ... */ };

  // --- FUNCIÓN DE ASIGNACIÓN MEJORADA ---
  const handleOpenAssignModal = (plan: any, type: 'training' | 'nutrition') => {
    setPlanToAssign({ plan, type });
    setModal('assign_plan');
  };

  if (activeView.type === 'training_details') { /* ... sin cambios ... */ }
  if (activeView.type === 'nutrition_details') { /* ... sin cambios ... */ }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">{/* ... sin cambios ... */}</div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Planes de Entrenamiento */}
        <Card>
          <CardHeader>
            <CardTitle>Planes de Entrenamiento</CardTitle>
            <CardDescription>Haz clic en un plan para ver sus ejercicios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {trainingPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50">
                <div onClick={() => setActiveView({ type: 'training_details', data: plan })} className="flex-grow cursor-pointer">
                  <h4 className="font-medium text-card-foreground">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                {/* Pasamos el tipo 'training' al hacer clic */}
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(plan, 'training'); }}>
                  <UserPlus className="mr-2 h-4 w-4" /> Asignar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Planes de Nutrición */}
        <Card>
          <CardHeader>
            <CardTitle>Planes de Nutrición</CardTitle>
            <CardDescription>Haz clic en un plan para ver sus comidas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {nutritionPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-muted/50">
                <div className="flex-grow cursor-pointer" onClick={() => setActiveView({ type: 'nutrition_details', data: plan })}>
                  <h4 className="font-medium text-card-foreground">{plan.name}</h4>
                  <p className="text-sm text-muted-foreground">{plan.calories ? `${plan.calories} kcal` : (plan.description || 'Sin descripción')}</p>
                </div>
                {/* --- BOTÓN HABILITADO --- */}
                {/* Pasamos el tipo 'nutrition' al hacer clic */}
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(plan, 'nutrition'); }}>
                  <UserPlus className="mr-2 h-4 w-4" /> Asignar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Modales */}
      <Dialog open={modal === 'new_training'} onOpenChange={(isOpen) => !isOpen && setModal('closed')}>{/* ... */}</Dialog>
      <Dialog open={modal === 'new_nutrition'} onOpenChange={(isOpen) => !isOpen && setModal('closed')}>{/* ... */}</Dialog>
      
      {/* --- RENDERIZADO DEL MODAL MEJORADO --- */}
      {planToAssign.plan && (
        <AssignPlanModal
          plan={planToAssign.plan}
          planType={planToAssign.type}
          isOpen={modal === 'assign_plan'}
          onClose={() => setModal('closed')}
          onPlanAssigned={() => { /* Puedes mostrar una notificación aquí */ }}
        />
      )}
    </div>
  );
}
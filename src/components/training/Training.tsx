// src/components/training/Training.tsx

import React, { useState, useEffect, useCallback } from 'react';
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
  const [isSaving, setIsSaving] = useState(false);

  // --- MEJORA 1: Centralizamos la vista activa en un solo estado ---
  const [activeView, setActiveView] = useState<{ type: 'list' | 'training_details' | 'nutrition_details', data: any }>({ type: 'list', data: null });

  // Estados para los modales
  const [modal, setModal] = useState<'closed' | 'new_training' | 'new_nutrition' | 'assign_plan'>('closed');
  const [planToAssign, setPlanToAssign] = useState(null);

  // Estados para los formularios
  const [newTrainingPlan, setNewTrainingPlan] = useState(initialTrainingPlanState);
  const [newNutritionPlan, setNewNutritionPlan] = useState(initialNutritionPlanState);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const { data: trainingData } = await supabase.from("training_plans").select("*").order('created_at', { ascending: false });
    const { data: nutritionData } = await supabase.from("nutrition_plans").select("*").order('created_at', { ascending: false });
    
    setTrainingPlans(trainingData || []);
    setNutritionPlans(nutritionData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveTrainingPlan = async () => {
    if (!newTrainingPlan.name) { alert("El nombre es obligatorio."); return; }
    setIsSaving(true);
    await supabase.from("training_plans").insert([{ name: newTrainingPlan.name, description: newTrainingPlan.description }]);
    setModal('closed');
    setNewTrainingPlan(initialTrainingPlanState);
    await fetchPlans();
    setIsSaving(false);
  };

  const handleSaveNutritionPlan = async () => {
    if (!newNutritionPlan.name) { alert("El nombre es obligatorio."); return; }
    setIsSaving(true);
    await supabase.from("nutrition_plans").insert([{ name: newNutritionPlan.name, description: newNutritionPlan.description, calories: Number(newNutritionPlan.calories) || null }]);
    setModal('closed');
    setNewNutritionPlan(initialNutritionPlanState);
    await fetchPlans();
    setIsSaving(false);
  };
  
  const handleOpenAssignModal = (plan: any) => {
    setPlanToAssign(plan);
    setModal('assign_plan');
  };

  // --- LÓGICA DE RENDERIZADO CENTRALIZADA ---
  if (loading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">Cargando...</span></div>;
  }
  
  if (activeView.type === 'training_details') {
    return <PlanDetails plan={activeView.data} onBack={() => setActiveView({ type: 'list', data: null })} />;
  }
  
  if (activeView.type === 'nutrition_details') {
    return <NutritionPlanDetails plan={activeView.data} onBack={() => setActiveView({ type: 'list', data: null })} />;
  }

  // Vista principal (lista de planes)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Entrenamiento y Nutrición</h1>
          <p className="text-muted-foreground">Crea y asigna planes personalizados a tus socios.</p>
        </div>
        <div className="flex space-x-2">
            <Button variant="iron" onClick={() => setModal('new_training')}>
                <Plus className="mr-2 h-4 w-4" /> Plan de Entrenamiento
            </Button>
            <Button variant="outline" onClick={() => setModal('new_nutrition')}>
                <Plus className="mr-2 h-4 w-4" /> Plan de Nutrición
            </Button>
        </div>
      </div>

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
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpenAssignModal(plan); }}>
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
                <Button size="sm" variant="outline" disabled>
                  <UserPlus className="mr-2 h-4 w-4" /> Asignar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Modales */}
      <Dialog open={modal === 'new_training'} onOpenChange={(isOpen) => !isOpen && setModal('closed')}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Nuevo Plan de Entrenamiento</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <Input name="name" value={newTrainingPlan.name} onChange={handleInputChange(setNewTrainingPlan)} placeholder="Ej: Rutina de Fuerza - 3 Días" />
              <Textarea name="description" value={newTrainingPlan.description} onChange={handleInputChange(setNewTrainingPlan)} placeholder="Ej: Enfocada en hipertrofia y fuerza máxima." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal('closed')}>Cancelar</Button>
              <Button onClick={handleSaveTrainingPlan} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Guardar
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={modal === 'new_nutrition'} onOpenChange={(isOpen) => !isOpen && setModal('closed')}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Nuevo Plan de Nutrición</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <Input name="name" value={newNutritionPlan.name} onChange={handleInputChange(setNewNutritionPlan)} placeholder="Ej: Dieta de Volumen Limpio" />
              <Input name="calories" type="number" value={newNutritionPlan.calories} onChange={handleInputChange(setNewNutritionPlan)} placeholder="Ej: 2500 (Calorías totales)" />
              <Textarea name="description" value={newNutritionPlan.description} onChange={handleInputChange(setNewNutritionPlan)} placeholder="Ej: Alta en proteínas, moderada en carbohidratos." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal('closed')}>Cancelar</Button>
              <Button onClick={handleSaveNutritionPlan} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Guardar
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {planToAssign && (
        <AssignPlanModal plan={planToAssign} isOpen={modal === 'assign_plan'} onClose={() => setModal('closed')} onPlanAssigned={() => {}} />
      )}
    </div>
  );
}
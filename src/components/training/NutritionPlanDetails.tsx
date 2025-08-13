// src/components/training/NutritionPlanDetails.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Loader2, Trash2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Definimos la estructura de las props que recibirá el componente
interface NutritionPlanDetailsProps {
  plan: { id: string; name: string; calories: number };
  onBack: () => void;
}

// Estructura para el formulario de comidas
const initialMealState = {
  id: '', // ID de la entrada en nutrition_plan_meals
  meal_id: '',
  name: '',
  meal_type: '',
  quantity: '',
  calories: ''
};

export function NutritionPlanDetails({ plan, onBack }: NutritionPlanDetailsProps) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para el modal
  const [modalState, setModalState] = useState<'closed' | 'add' | 'edit'>('closed');
  const [currentMeal, setCurrentMeal] = useState(initialMealState);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nutrition_plan_meals')
      .select(`
        id,
        meal_type,
        quantity,
        meals (
          id,
          name,
          calories
        )
      `)
      .eq('plan_id', plan.id)
      .order('created_at', { ascending: true });

    if (error) console.error("Error fetching meals:", error);
    else setMeals(data || []);
    setLoading(false);
  }, [plan.id]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const openModal = (mode: 'add' | 'edit', mealItem: any = null) => {
    setModalState(mode);
    if (mode === 'edit' && mealItem) {
      setCurrentMeal({
        id: mealItem.id, // ID de la relación plan-comida
        meal_id: mealItem.meals.id,
        name: mealItem.meals.name,
        meal_type: mealItem.meal_type,
        quantity: mealItem.quantity,
        calories: mealItem.meals.calories || ''
      });
    } else {
      setCurrentMeal(initialMealState);
    }
  };

  const closeModal = () => setModalState('closed');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMeal(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveMeal = async () => {
    if (!currentMeal.name || !currentMeal.meal_type || !currentMeal.quantity) {
      alert("Tipo de comida, nombre y cantidad son obligatorios.");
      return;
    }
    setIsSaving(true);
    
    // 1. Busca o crea la comida en la tabla 'meals'
    let { data: meal, error: selectError } = await supabase.from('meals').select('id').eq('name', currentMeal.name).single();
    if (!meal) {
        const { data: newMealData, error } = await supabase.from('meals').insert({ name: currentMeal.name, calories: Number(currentMeal.calories) || null }).select().single();
        if (error) { console.error(error); setIsSaving(false); return; }
        meal = newMealData;
    }

    if (modalState === 'add') {
      // 2. Asocia la comida al plan
      const { error } = await supabase.from('nutrition_plan_meals').insert({ plan_id: plan.id, meal_id: meal.id, meal_type: currentMeal.meal_type, quantity: currentMeal.quantity });
      if (error) alert("Error al añadir la comida.");
    } else if (modalState === 'edit') {
      // 2. Actualiza la asociación en el plan
      const { error } = await supabase.from('nutrition_plan_meals').update({ meal_type: currentMeal.meal_type, quantity: currentMeal.quantity }).eq('id', currentMeal.id);
      if (error) alert("Error al actualizar la comida.");
    }

    closeModal();
    await fetchMeals();
    setIsSaving(false);
  };
  
  const handleDeleteMeal = async (planMealId: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta comida del plan?")) return;
    
    const { error } = await supabase.from('nutrition_plan_meals').delete().eq('id', planMealId);
    if (error) alert("Error al eliminar la comida.");
    else await fetchMeals();
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Planes
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>Total de calorías: {plan.calories || 'No especificado'}</CardDescription>
            </div>
            <Button onClick={() => openModal('add')}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Comida
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? <p>Cargando comidas...</p> :
             meals.length > 0 ? meals.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <Badge className="mb-1">{item.meal_type}</Badge>
                  <p className="font-medium">{item.meals.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="font-medium">{item.quantity}</p>
                        {item.meals.calories && <p className="text-sm text-muted-foreground">{item.meals.calories} kcal</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openModal('edit', item)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteMeal(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground text-center py-4">Este plan aún no tiene comidas.</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalState !== 'closed'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
        <DialogContent>
          <DialogHeader><DialogTitle>{modalState === 'add' ? 'Añadir Comida' : `Editar Comida`}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input name="meal_type" placeholder="Tipo (Ej: Desayuno)" value={currentMeal.meal_type} onChange={handleInputChange} />
            <Input name="name" placeholder="Nombre (Ej: Pechuga de Pollo)" value={currentMeal.name} onChange={handleInputChange} disabled={modalState === 'edit'} />
            <Input name="quantity" placeholder="Cantidad (Ej: 150g)" value={currentMeal.quantity} onChange={handleInputChange} />
            <Input name="calories" type="number" placeholder="Calorías (opcional)" value={currentMeal.calories} onChange={handleInputChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSaveMeal} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
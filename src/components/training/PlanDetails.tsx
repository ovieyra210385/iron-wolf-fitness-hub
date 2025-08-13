// src/components/training/PlanDetails.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus, ArrowLeft, Loader2, Trash2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Definimos la estructura de las props que recibirá el componente
interface PlanDetailsProps {
  plan: { id: string; name: string; description: string };
  onBack: () => void; // Función para regresar a la lista de planes
}

// Estructura para el formulario de ejercicio
const initialExerciseState = {
  exercise_id: '',
  name: '',
  sets: '',
  reps: '',
  rest_period: ''
};

export function PlanDetails({ plan, onBack }: PlanDetailsProps) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para el modal: puede estar 'closed', 'add', o 'edit'
  const [modalState, setModalState] = useState<'closed' | 'add' | 'edit'>('closed');
  const [currentExercise, setCurrentExercise] = useState(initialExerciseState);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plan_exercises')
      .select(`*, exercises(*)`)
      .eq('plan_id', plan.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error al cargar los ejercicios:", error);
    } else {
      setExercises(data || []);
    }
    setLoading(false);
  }, [plan.id]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);
  
  // --- LÓGICA DEL MODAL ---
  const openModal = (mode: 'add' | 'edit', exercise: any = null) => {
    setModalState(mode);
    if (mode === 'edit' && exercise) {
      // Si estamos editando, poblamos el formulario con los datos del ejercicio
      setCurrentExercise({
        exercise_id: exercise.exercises.id,
        name: exercise.exercises.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_period: exercise.rest_period || ''
      });
    } else {
      // Si vamos a añadir, reseteamos el formulario
      setCurrentExercise(initialExerciseState);
    }
  };

  const closeModal = () => {
    setModalState('closed');
    setCurrentExercise(initialExerciseState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({ ...prev, [name]: value }));
  };
  
  // --- LÓGICA PARA GUARDAR O ACTUALIZAR ---
  const handleSaveExercise = async () => {
    if (modalState === 'add') {
      // Lógica para añadir un nuevo ejercicio (la que ya teníamos)
      if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) {
        alert("Debes completar el nombre, las series y las repeticiones.");
        return;
      }
      setIsSaving(true);
      
      let { data: exercise, error: selectError } = await supabase.from('exercises').select('id').eq('name', currentExercise.name).single();
      if (!exercise) {
        const { data: newEx, error: insertExError } = await supabase.from('exercises').insert({ name: currentExercise.name }).select().single();
        if (insertExError) { console.error(insertExError); setIsSaving(false); return; }
        exercise = newEx;
      }
      
      const { error: linkError } = await supabase.from('plan_exercises').insert({ plan_id: plan.id, exercise_id: exercise.id, sets: currentExercise.sets, reps: currentExercise.reps, rest_period: currentExercise.rest_period });
      if (linkError) { alert("Error al asociar ejercicio."); } else {
        closeModal();
        await fetchExercises();
      }
      setIsSaving(false);

    } else if (modalState === 'edit') {
      // Lógica para actualizar un ejercicio existente
      setIsSaving(true);
      const { error } = await supabase
        .from('plan_exercises')
        .update({
          sets: currentExercise.sets,
          reps: currentExercise.reps,
          rest_period: currentExercise.rest_period
        })
        .eq('plan_id', plan.id)
        .eq('exercise_id', currentExercise.exercise_id);
      
      if (error) {
        console.error("Error actualizando ejercicio:", error);
        alert("No se pudo actualizar el ejercicio.");
      } else {
        closeModal();
        await fetchExercises();
      }
      setIsSaving(false);
    }
  };

  // --- NUEVA FUNCIÓN PARA ELIMINAR ---
  const handleDeleteExercise = async (exerciseId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este ejercicio del plan?")) {
      return;
    }
    const { error } = await supabase
      .from('plan_exercises')
      .delete()
      .eq('plan_id', plan.id)
      .eq('exercise_id', exerciseId);
    
    if (error) {
      alert("No se pudo eliminar el ejercicio.");
    } else {
      await fetchExercises();
    }
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
              <CardDescription>{plan.description}</CardDescription>
            </div>
            <Button onClick={() => openModal('add')}>
              <Plus className="mr-2 h-4 w-4" />
              Añadir Ejercicio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? <p>Cargando ejercicios...</p> : 
             exercises.length > 0 ? exercises.map((ex) => (
              <div key={ex.exercises.id} className="p-3 border rounded-lg flex justify-between items-center">
                <span className="font-medium">{ex.exercises.name}</span>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Series: <strong>{ex.sets}</strong></span>
                    <span>Reps: <strong>{ex.reps}</strong></span>
                    <span>Descanso: <strong>{ex.rest_period || 'N/A'}</strong></span>
                </div>
                {/* --- BOTONES DE ACCIÓN --- */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openModal('edit', ex)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteExercise(ex.exercises.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </div>
            )) : <p className="text-sm text-muted-foreground text-center py-4">Este plan aún no tiene ejercicios.</p>
            }
          </div>
        </CardContent>
      </Card>

      {/* Modal para añadir/editar ejercicio */}
      <Dialog open={modalState !== 'closed'} onOpenChange={(isOpen) => !isOpen && closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalState === 'add' ? 'Añadir Ejercicio' : 'Editar Ejercicio'}</DialogTitle>
            <DialogDescription>
              {modalState === 'add' ? 'Busca o crea un nuevo ejercicio.' : `Editando detalles para "${currentExercise.name}".`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input name="name" placeholder="Nombre del Ejercicio" value={currentExercise.name} onChange={handleInputChange} disabled={modalState === 'edit'} />
            <Input name="sets" placeholder="Series (Ej: 4)" value={currentExercise.sets} onChange={handleInputChange} />
            <Input name="reps" placeholder="Repeticiones (Ej: 10-12)" value={currentExercise.reps} onChange={handleInputChange} />
            <Input name="rest_period" placeholder="Descanso (Ej: 60s)" value={currentExercise.rest_period} onChange={handleInputChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button onClick={handleSaveExercise} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
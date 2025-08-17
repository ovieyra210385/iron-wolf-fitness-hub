// src/pages/Classes.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

const initialClassState = { id: null, name: '', description: '', trainer_name: '', duration_minutes: 60, max_capacity: 10 };

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(initialClassState);

  const fetchClasses = async () => { /* ... (código para obtener clases) ... */ };
  useEffect(() => { fetchClasses(); }, []);

  const handleSaveClass = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('classes').upsert(currentClass);
    if (error) {
      alert(error.message);
    } else {
      setModalOpen(false);
      fetchClasses();
    }
    setIsSaving(false);
  };

  const handleDeleteClass = async (classId) => { /* ... (código para eliminar clases) ... */ };

  // ... (JSX para la tabla, botones y modal)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Clases</h1>
        <Button onClick={() => { setCurrentClass(initialClassState); setModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Clase
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Catálogo de Clases</CardTitle></CardHeader>
        <CardContent>
          {/* ... (mapeo de 'classes' para mostrar cada una con botones de editar/eliminar) ... */}
        </CardContent>
      </Card>
      
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentClass.id ? 'Editar' : 'Crear'} Clase</DialogTitle></DialogHeader>
          {/* ... (Inputs del formulario para nombre, descripción, etc.) ... */}
          <Button onClick={handleSaveClass} disabled={isSaving}>Guardar</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
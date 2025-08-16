// src/pages/Classes.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

// Estado inicial para el formulario, ayuda a limpiar el modal
const initialClassState = {
  id: null,
  name: '',
  description: '',
  trainer_name: '',
  duration_minutes: 60,
  max_capacity: 10
};

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para controlar el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(initialClassState);

  // Cargar las clases desde Supabase al montar el componente
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('classes').select('*').order('name');
    if (!error) setClasses(data || []);
    setLoading(false);
  };

  // Funciones para manejar el modal
  const openModalToCreate = () => {
    setCurrentClass(initialClassState);
    setModalOpen(true);
  };

  const openModalToEdit = (cls) => {
    setCurrentClass(cls);
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({ ...prev, [name]: value }));
  };

  // Función para guardar (crear o actualizar)
  const handleSaveClass = async () => {
    if (!currentClass.name) {
      alert("El nombre de la clase es obligatorio.");
      return;
    }
    setIsSaving(true);
    // Si 'id' existe, actualizamos. Si no, insertamos.
    const { error } = await supabase
      .from('classes')
      .upsert(currentClass); // upsert = insert or update

    if (error) {
      alert(`Error al guardar la clase: ${error.message || JSON.stringify(error)}`);
      console.error(error);
    } else {
      setModalOpen(false);
      await fetchClasses(); // Recargamos la lista
    }
    setIsSaving(false);
  };

  // Función para eliminar una clase
  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta clase? Esto no se puede deshacer.")) {
        return;
    }
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    if (error) {
        alert("Error al eliminar la clase.");
    } else {
        await fetchClasses();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Gestión de Clases</h1>
          <p className="text-muted-foreground">Crea y administra las clases grupales de tu gimnasio.</p>
        </div>
        <Button variant="iron" size="lg" onClick={openModalToCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Clases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <p>Cargando clases...</p> : classes.map((cls) => (
            <div key={cls.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50">
              <div>
                <h3 className="font-medium text-card-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">Entrenador: {cls.trainer_name} | Capacidad: {cls.max_capacity} personas</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => openModalToEdit(cls)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDeleteClass(cls.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal para Crear/Editar Clases */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentClass.id ? 'Editar Clase' : 'Crear Nueva Clase'}</DialogTitle>
            <DialogDescription>Completa los detalles de la clase.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input name="name" placeholder="Nombre (Ej: Yoga Vinyasa)" value={currentClass.name} onChange={handleInputChange} />
            <Textarea name="description" placeholder="Descripción breve de la clase" value={currentClass.description} onChange={handleInputChange} />
            <Input name="trainer_name" placeholder="Nombre del Entrenador" value={currentClass.trainer_name} onChange={handleInputChange} />
            <Input name="duration_minutes" type="number" placeholder="Duración (minutos)" value={currentClass.duration_minutes} onChange={handleInputChange} />
            <Input name="max_capacity" type="number" placeholder="Capacidad Máxima" value={currentClass.max_capacity} onChange={handleInputChange} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveClass} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
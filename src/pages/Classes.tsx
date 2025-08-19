// src/pages/Classes.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, Loader2, ArrowLeft, Clock } from "lucide-react";

// --- NUEVO COMPONENTE INTERNO PARA GESTIONAR HORARIOS ---
function ClassScheduleManager({ selectedClass, onBack }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ day_of_week: '1', start_time: '07:00' });

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('class_schedule')
      .select('*')
      .eq('class_id', selectedClass.id)
      .order('day_of_week')
      .order('start_time');
    if (!error) setSchedules(data || []);
    setLoading(false);
  }, [selectedClass.id]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSaveSchedule = async () => {
    const [hour, minute] = newSchedule.start_time.split(':');
    const startTime = new Date(0); // Usamos fecha base para solo guardar la hora
    startTime.setUTCHours(Number(hour), Number(minute), 0, 0);

    const endTime = new Date(startTime.getTime() + selectedClass.duration_minutes * 60000);

    const { error } = await supabase.from('class_schedule').insert({
      class_id: selectedClass.id,
      day_of_week: parseInt(newSchedule.day_of_week, 10),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    if (error) {
        alert("Error al guardar el horario.");
        console.error(error);
    } else {
      setShowModal(false);
      fetchSchedules();
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
      if (!window.confirm("¿Seguro que quieres eliminar este horario?")) return;
      const { error } = await supabase.from('class_schedule').delete().eq('id', scheduleId);
      if (error) alert("Error al eliminar.");
      else fetchSchedules();
  }

  const daysOfWeek = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="space-y-4">
      <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Volver a Clases</Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Horarios para: {selectedClass.name}</CardTitle>
              <CardDescription>Define los días y horas en que se imparte esta clase.</CardDescription>
            </div>
            <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" />Añadir Horario</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p>Cargando...</p> : schedules.map(sch => (
            <div key={sch.id} className="p-3 border rounded-lg flex justify-between items-center mb-2">
              <p className="font-medium">{daysOfWeek[sch.day_of_week]}</p>
              <p className="flex items-center"><Clock className="mr-2 h-4 w-4" />{new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteSchedule(sch.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo Horario</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={(value) => setNewSchedule(p => ({...p, day_of_week: value}))} defaultValue="1">
              <SelectTrigger><SelectValue placeholder="Selecciona un día" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Lunes</SelectItem>
                <SelectItem value="2">Martes</SelectItem>
                <SelectItem value="3">Miércoles</SelectItem>
                <SelectItem value="4">Jueves</SelectItem>
                <SelectItem value="5">Viernes</SelectItem>
                <SelectItem value="6">Sábado</SelectItem>
                <SelectItem value="7">Domingo</SelectItem>
              </SelectContent>
            </Select>
            <Input type="time" value={newSchedule.start_time} onChange={(e) => setNewSchedule(p => ({...p, start_time: e.target.value}))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSaveSchedule}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
const initialClassState = { id: null, name: '', description: '', trainer_name: '', duration_minutes: 60, max_capacity: 10 };

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState(initialClassState);
  
  // Nuevo estado para controlar qué vista mostrar (lista o detalle de una clase)
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('classes').select('*').order('name');
    if (!error) setClasses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // Solo cargamos la lista de clases si no estamos viendo los detalles de una
    if (!selectedClass) {
      fetchClasses();
    }
  }, [selectedClass]);

  const openModalToCreate = () => {
    setCurrentClass(initialClassState);
    setModalOpen(true);
  };
  const openModalToEdit = (cls) => {
    setCurrentClass(cls);
    setModalOpen(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClass(prev => ({ ...prev, [name]: value }));
  };
  const handleSaveClass = async () => {
    if (!currentClass.name) return;
    setIsSaving(true);
    const { error } = await supabase.from('classes').upsert(currentClass, { onConflict: 'id' });
    if (error) {
      alert("Error al guardar.");
      console.error(error);
    } else {
      setModalOpen(false);
      fetchClasses();
    }
    setIsSaving(false);
  };
  const handleDeleteClass = async (classId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta clase?")) return;
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    if (error) alert("Error al eliminar.");
    else fetchClasses();
  };

  // Si hay una clase seleccionada, mostramos el gestor de horarios
  if (selectedClass) {
    return <ClassScheduleManager selectedClass={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  // Si no, mostramos la lista principal de clases
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
          <CardDescription>Selecciona una clase para gestionar sus horarios.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <p>Cargando...</p> : classes.map((cls) => (
            <div key={cls.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50">
              <div className="flex-grow cursor-pointer" onClick={() => setSelectedClass(cls)}>
                <h3 className="font-medium text-card-foreground">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">Entrenador: {cls.trainer_name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={(e) => {e.stopPropagation(); openModalToEdit(cls)}}><Edit className="h-4 w-4" /></Button>
                <Button variant="destructive" size="icon" onClick={(e) => {e.stopPropagation(); handleDeleteClass(cls.id)}}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
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
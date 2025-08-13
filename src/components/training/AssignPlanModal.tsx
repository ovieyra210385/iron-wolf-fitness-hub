// src/components/training/AssignPlanModal.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface AssignPlanModalProps {
  plan: { id: string; name: string; };
  isOpen: boolean;
  onClose: () => void;
  onPlanAssigned: () => void; // Callback para saber que se asignó correctamente
}

export function AssignPlanModal({ plan, isOpen, onClose, onPlanAssigned }: AssignPlanModalProps) {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Cargar socios cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('members')
          .select('id, name, email')
          .order('name', { ascending: true });
        
        if (error) console.error("Error fetching members:", error);
        else setMembers(data || []);
        setLoading(false);
      };
      fetchMembers();
    }
  }, [isOpen]);

  // Filtrar socios según el término de búsqueda
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignPlan = async (memberId: string) => {
    setIsAssigning(true);
    const today = new Date().toISOString().split('T')[0]; // Fecha de inicio es hoy

    const { error } = await supabase
      .from('member_plans')
      .insert({
        member_id: memberId,
        training_plan_id: plan.id,
        start_date: today,
        is_active: true
      });

    if (error) {
      alert("Error al asignar el plan. Es posible que el socio ya tenga este plan activo.");
      console.error("Error de asignación:", error);
    } else {
      alert(`¡Plan "${plan.name}" asignado correctamente!`);
      onPlanAssigned(); // Ejecutamos el callback
      onClose(); // Cerramos el modal
    }
    setIsAssigning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Plan: {plan.name}</DialogTitle>
          <DialogDescription>
            Busca y selecciona un socio para asignarle este plan de entrenamiento.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 max-h-[300px] overflow-y-auto space-y-2">
          {loading ? <div className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : 
           filteredMembers.map(member => (
            <div key={member.id} className="p-2 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <Button size="sm" onClick={() => handleAssignPlan(member.id)} disabled={isAssigning}>
                {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Asignar"}
              </Button>
            </div>
           ))
          }
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
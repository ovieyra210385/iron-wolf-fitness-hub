// src/components/training/AssignPlanModal.tsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface AssignPlanModalProps {
  plan: { id: string; name: string; };
  planType: 'training' | 'nutrition'; // <-- NUEVA PROP para diferenciar el tipo de plan
  isOpen: boolean;
  onClose: () => void;
  onPlanAssigned: () => void;
}

export function AssignPlanModal({ plan, planType, isOpen, onClose, onPlanAssigned }: AssignPlanModalProps) {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('members').select('id, name, email').order('name');
        if (error) console.error("Error fetching members:", error);
        else setMembers(data || []);
        setLoading(false);
      };
      fetchMembers();
    }
  }, [isOpen]);

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignPlan = async (memberId: string) => {
    setIsAssigning(true);
    const today = new Date().toISOString().split('T')[0];

    // --- LÓGICA MEJORADA ---
    // Creamos el objeto a insertar dinámicamente
    const assignmentData = {
      member_id: memberId,
      start_date: today,
      is_active: true,
      training_plan_id: planType === 'training' ? plan.id : null,
      nutrition_plan_id: planType === 'nutrition' ? plan.id : null,
    };

    const { error } = await supabase
      .from('member_plans')
      .insert(assignmentData);

    if (error) {
      alert("Error al asignar el plan. Es posible que el socio ya tenga un plan de este tipo activo.");
      console.error("Error de asignación:", error);
    } else {
      alert(`¡Plan "${plan.name}" asignado correctamente!`);
      onPlanAssigned();
      onClose();
    }
    setIsAssigning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Plan de {planType === 'training' ? 'Entrenamiento' : 'Nutrición'}: {plan.name}</DialogTitle>
          <DialogDescription>
            Busca y selecciona un socio para asignarle este plan.
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
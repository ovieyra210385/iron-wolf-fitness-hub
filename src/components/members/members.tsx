// src/components/members/members.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Users, UserPlus, Search, Filter, Mail, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { MemberAchievements } from "./MemberAchievements"; // ¡Importamos nuestro componente de logros!

// --- NUEVO COMPONENTE INTERNO PARA EL PERFIL DEL SOCIO ---
// Este componente se encargará de mostrar toda la información de un solo socio.
function MemberProfile({ member, onBack }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista de socios
      </Button>
      
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-iron rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
                <CardTitle className="text-3xl">{member.name}</CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-2">
                    <span className="flex items-center"><Mail className="h-4 w-4 mr-1.5 text-muted-foreground" /> {member.email}</span>
                    <span className="flex items-center"><Phone className="h-4 w-4 mr-1.5 text-muted-foreground" /> {member.phone || 'No disponible'}</span>
                </CardDescription>
            </div>
        </CardHeader>
      </Card>

      {/* Aquí es donde integramos nuestro componente de logros */}
      <MemberAchievements memberId={member.id} />

      {/* En el futuro, aquí podrías añadir más tarjetas:
        - Planes de entrenamiento y nutrición asignados.
        - Historial de pagos.
        - Registro de asistencia.
      */}
    </div>
  );
}


export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", membership: "Básico Mensual", status: 'Activo' });
  const [saving, setSaving] = useState(false);
  
  // --- NUEVO ESTADO PARA VER EL PERFIL DE UN SOCIO ---
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("members").select("*").order("name", { ascending: true });
    if (!error) setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    // Solo cargamos la lista de socios si no estamos viendo un perfil
    if (!selectedMember) { 
      fetchMembers();
    }
  }, [selectedMember]);

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddMember = async () => {
    setSaving(true);
    const { error } = await supabase.from("members").insert([form]);
    if (!error) {
      setShowModal(false);
      fetchMembers(); // Recargamos la lista
    }
    setSaving(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo": return "bg-fitness-energy text-fitness-dark";
      case "Suspendido": return "bg-destructive text-destructive-foreground";
      case "Vencido": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Si hay un socio seleccionado, muestra su perfil en lugar de la lista
  if (selectedMember) {
    return <MemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Gestión de Socios</h1>
          <p className="text-muted-foreground">Administra membresías, altas, bajas y renovaciones</p>
        </div>
        <Button variant="iron" size="lg" onClick={() => setShowModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Socio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Socios</CardTitle>
          <CardDescription>Haz clic en un socio para ver su perfil y logros.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : members.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" 
                  onClick={() => setSelectedMember(member)} // <-- Acción de clic para ver el perfil
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-iron rounded-full flex items-center justify-center text-white font-bold">
                        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <h3 className="font-medium text-card-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                      <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                      <p className="text-xs text-muted-foreground">{member.membership}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Socio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input name="name" placeholder="Nombre completo" onChange={handleInput} required />
            <Input name="email" placeholder="Email" onChange={handleInput} required />
            <Input name="phone" placeholder="Teléfono" onChange={handleInput} />
            <Input name="membership" placeholder="Membresía" onChange={handleInput} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleAddMember} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
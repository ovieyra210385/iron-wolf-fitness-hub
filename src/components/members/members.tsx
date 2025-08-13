// src/components/members/members.tsx

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { Users, UserPlus, Search, Filter, Mail, Phone, ArrowLeft } from "lucide-react";
import { MemberAchievements } from "./MemberAchievements"; // ¡Importamos nuestro nuevo componente!

// --- NUEVO COMPONENTE INTERNO PARA EL PERFIL DEL SOCIO ---
function MemberProfile({ member, onBack }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista de socios
      </Button>
      
      <Card>
        <CardHeader>
            <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-iron rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                    <CardTitle className="text-3xl">{member.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                        <span className="flex items-center"><Mail className="h-4 w-4 mr-1 text-muted-foreground" /> {member.email}</span>
                        <span className="flex items-center"><Phone className="h-4 w-4 mr-1 text-muted-foreground" /> {member.phone}</span>
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {/* Aquí integramos nuestro componente de logros */}
          <MemberAchievements memberId={member.id} />
        </CardContent>
      </Card>

      {/* Aquí podrías añadir más tarjetas con sus planes de entrenamiento, historial de pagos, etc. */}
    </div>
  );
}


export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", membership: "Básico Mensual" });
  const [saving, setSaving] = useState(false);
  
  // --- NUEVO ESTADO PARA VER EL PERFIL DE UN SOCIO ---
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("members").select("*").order("name", { ascending: true });
      if (!error) setMembers(data || []);
      setLoading(false);
    };
    if (!selectedMember) { // Solo carga la lista si no estamos viendo un perfil
      fetchMembers();
    }
  }, [selectedMember]);

  // ... (tus funciones handleInput y handleAddMember se mantienen igual)

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Activo': return 'bg-emerald-500/20 text-emerald-600';
      case 'Vencido': return 'bg-red-500/20 text-red-600';
      case 'Suspendido': return 'bg-yellow-500/20 text-yellow-600';
      default: return 'bg-slate-500/20 text-slate-600';
    }
  };

  // Si hay un socio seleccionado, muestra su perfil
  if (selectedMember) {
    return <MemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  // Si no, muestra la lista de socios
  return (
    <div className="space-y-6">
        {/* ... (Todo el JSX del header y las stats cards se mantiene igual) ... */}
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Socios</CardTitle>
          <CardDescription>Haz clic en un socio para ver su perfil y logros.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <p>Cargando...</p> : members.map((member) => (
                // --- AÑADIMOS EL ONCLICK A TODA LA FILA ---
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedMember(member)}>
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
      
      {/* ... (El JSX del modal para añadir socio se mantiene igual) ... */}
    </div>
  );
}
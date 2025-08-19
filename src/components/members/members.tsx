// src/components/members/members.tsx

import { useEffect, useState, useCallback } from "react"; // Limpiamos los imports duplicados
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { ActivityCard } from "./ActivityCard";
import { Users, UserPlus, Search, Filter, Mail, Phone, ArrowLeft, Loader2, Fingerprint } from "lucide-react";
import { MemberAchievements } from "./MemberAchievements";

// --- NUEVO COMPONENTE PARA LA GESTIÓN BIOMÉTRICA ---
function BiometricAccessCard({ memberId }) {
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkEnrollment = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('facial_access_data')
      .select('id')
      .eq('member_id', memberId)
      .single();
    
    setEnrolled(!!data);
    setLoading(false);
  }, [memberId]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  const handleEnroll = async () => {
    setLoading(true);
    // Simulación de captura y guardado. En un caso real, esto llamaría a una Edge Function.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { error } = await supabase.from('facial_access_data').insert({
        member_id: memberId,
        face_vector_id: `vec_${Math.random().toString(36).substring(2, 11)}`,
        provider: 'Simulated Device'
    });

    if (error) {
        alert("Error al enrolar. Asegúrate de que las políticas de RLS permitan esta acción.");
        console.error(error);
    } else {
        await checkEnrollment();
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acceso Biométrico</CardTitle>
        <CardDescription>Gestiona el acceso por huella o rostro.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Fingerprint className={`mx-auto h-12 w-12 mb-4 ${enrolled ? 'text-green-500' : 'text-muted-foreground'}`} />
        {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> :
          enrolled ? (
            <>
              <p className="font-semibold text-green-600">Socio Enrolado</p>
              <p className="text-sm text-muted-foreground">El acceso biométrico está activo.</p>
            </>
          ) : (
            <>
              <p className="font-semibold">Socio No Enrolado</p>
              <Button size="sm" className="mt-2" onClick={handleEnroll}>
                <UserPlus className="mr-2 h-4 w-4" />
                Registrar Biometría
              </Button>
            </>
          )
        }
      </CardContent>
    </Card>
  );
}


// --- PERFIL DEL SOCIO (REESTRUCTURADO Y LIMPIO) ---
function MemberProfile({ member, onBack }) {
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a la lista de socios
      </Button>
      
      {/* Tarjeta de Información Principal */}
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

      {/* Grid para las tarjetas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BiometricAccessCard memberId={member.id} />
        <ActivityCard memberId={member.id} />
      </div>

      <MemberAchievements memberId={member.id} />
    </div>
  );
}


// --- COMPONENTE PRINCIPAL Members (SIN CAMBIOS EN SU LÓGICA) ---
export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", membership: "Básico Mensual", status: 'Activo' });
  const [saving, setSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("members").select("*").order("name", { ascending: true });
    if (!error) setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => {
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
      fetchMembers();
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

  if (selectedMember) {
    return <MemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Gestión de Socios</h1>
          <p className="text-muted-foreground">Administra membresías, altas, bajas y renovaciones.</p>
        </div>
        <Button variant="iron" size="lg" onClick={() => setShowModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Socio
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Socios</CardTitle>
          <CardDescription>Haz clic en un socio para ver su perfil completo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div> : members.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" 
                  onClick={() => setSelectedMember(member)}
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
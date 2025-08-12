import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

export function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    membership: "Básico Mensual",
    status: "Activo",
    expires: "",
    visits: 0,
    lastVisit: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("members").select("*").order("id", { ascending: false });
      if (!error) setMembers(data || []);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddMember = async () => {
    setSaving(true);
    const { error } = await supabase.from("members").insert([form]);
    if (!error) {
      setShowModal(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        membership: "Básico Mensual",
        status: "Activo",
        expires: "",
        visits: 0,
        lastVisit: ""
      });
      // Refresca la lista
      const { data } = await supabase.from("members").select("*").order("id", { ascending: false });
      setMembers(data || []);
    }
    setSaving(false);
  };

  const membershipPlans = [
    { name: "Básico Mensual", price: "$599", features: ["Acceso al gym", "Clases grupales básicas"] },
    { name: "Premium Mensual", price: "$899", features: ["Acceso completo", "Todas las clases", "Nutrición"] },
    { name: "Premium Anual", price: "$8,990", features: ["Acceso completo", "Todas las clases", "Nutrición", "Descuento 15%"] },
    { name: "Pago por Visita", price: "$80/día", features: ["Acceso temporal", "Sin compromiso"] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo": return "bg-fitness-energy text-fitness-dark";
      case "Suspendido": return "bg-destructive text-destructive-foreground";
      case "Vencido": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-muted-foreground">Socios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-fitness-energy" />
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs text-muted-foreground">Vencen Este Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">$45,231</p>
                <p className="text-xs text-muted-foreground">Ingresos del Mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Nuevos Esta Semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Members List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Socios</CardTitle>
                <CardDescription>Gestión completa de membresías</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar socio..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-muted-foreground">Cargando socios...</div>
              ) : members.length === 0 ? (
                <div className="text-center text-muted-foreground">No hay socios registrados.</div>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-iron rounded-full flex items-center justify-center text-white font-bold">
                        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground">{member.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {member.membership}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vence: {member.expires}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Membership Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Planes de Membresía</CardTitle>
            <CardDescription>Opciones disponibles para socios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {membershipPlans.map((plan, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-card-foreground">{plan.name}</h3>
                  <span className="text-lg font-bold text-primary">{plan.price}</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="h-1 w-1 bg-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Operaciones frecuentes de gestión de socios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <UserPlus className="h-6 w-6 mb-2" />
              Registrar Nuevo Socio
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Renovar Membresía
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              Suspender Socio
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Procesar Pago por Visita
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Modal alta socio */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Socio</DialogTitle>
            <DialogDescription>Completa los datos para dar de alta un nuevo socio.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={e => {e.preventDefault(); handleAddMember();}}>
            <Input name="name" placeholder="Nombre completo" value={form.name} onChange={handleInput} required />
            <Input name="email" placeholder="Email" value={form.email} onChange={handleInput} required />
            <Input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleInput} />
            <Input name="membership" placeholder="Membresía" value={form.membership} onChange={handleInput} />
            <Input name="status" placeholder="Estado" value={form.status} onChange={handleInput} />
            <Input name="expires" placeholder="Fecha de vencimiento" value={form.expires} onChange={handleInput} />
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Guardando..." : "Registrar"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
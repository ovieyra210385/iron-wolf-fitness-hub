import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, CreditCard, Users, TrendingUp, Calendar } from "lucide-react";

interface Membership {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
  features: string[];
  is_active: boolean;
  member_count: number;
  created_at: string;
}

export function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_months: "",
    features: "",
    is_active: true,
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      // Simulated data - replace with actual Supabase call
      const mockMemberships: Membership[] = [
        {
          id: "1",
          name: "Básico Mensual",
          description: "Acceso completo al gimnasio durante horarios regulares",
          price: 599,
          currency: "MXN",
          duration_months: 1,
          features: ["Acceso al gym", "Vestidores", "Estacionamiento"],
          is_active: true,
          member_count: 87,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Premium Mensual",
          description: "Acceso completo + clases grupales + entrenador personal",
          price: 899,
          currency: "MXN",
          duration_months: 1,
          features: ["Todo lo básico", "Clases grupales", "2 sesiones PT/mes", "Nutritiólogo"],
          is_active: true,
          member_count: 156,
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Premium Anual",
          description: "Plan premium con descuento por pago anual",
          price: 8990,
          currency: "MXN",
          duration_months: 12,
          features: ["Todo lo premium", "20% descuento", "Plan nutricional", "Acceso 24/7"],
          is_active: true,
          member_count: 89,
          created_at: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Pago por Visita",
          description: "Pago flexible por cada visita al gimnasio",
          price: 80,
          currency: "MXN",
          duration_months: 0,
          features: ["Acceso por día", "Vestidores", "Sin compromisos"],
          is_active: true,
          member_count: 10,
          created_at: new Date().toISOString(),
        },
      ];

      setMemberships(mockMemberships);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las membresías.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const membershipData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: "MXN",
      duration_months: parseInt(formData.duration_months),
      features: formData.features.split(",").map(f => f.trim()),
      is_active: formData.is_active,
      member_count: 0,
      created_at: new Date().toISOString(),
    };

    if (editingMembership) {
      // Update membership
      const updatedMemberships = memberships.map(membership => 
        membership.id === editingMembership.id 
          ? { ...membership, ...membershipData }
          : membership
      );
      setMemberships(updatedMemberships);
      toast({
        title: "Membresía actualizada",
        description: "Los datos de la membresía han sido actualizados correctamente.",
      });
    } else {
      // Add new membership
      const newMembership: Membership = {
        id: Date.now().toString(),
        ...membershipData,
      };
      setMemberships([...memberships, newMembership]);
      toast({
        title: "Membresía creada",
        description: "La nueva membresía ha sido creada correctamente.",
      });
    }

    setIsDialogOpen(false);
    setEditingMembership(null);
    setFormData({ name: "", description: "", price: "", duration_months: "", features: "", is_active: true });
  };

  const handleEdit = (membership: Membership) => {
    setEditingMembership(membership);
    setFormData({
      name: membership.name,
      description: membership.description,
      price: membership.price.toString(),
      duration_months: membership.duration_months.toString(),
      features: membership.features.join(", "),
      is_active: membership.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (membershipId: string) => {
    setMemberships(memberships.filter(membership => membership.id !== membershipId));
    toast({
      title: "Membresía eliminada",
      description: "La membresía ha sido eliminada correctamente.",
    });
  };

  const totalRevenue = memberships.reduce((sum, membership) => 
    sum + (membership.price * membership.member_count), 0
  );

  const totalMembers = memberships.reduce((sum, membership) => 
    sum + membership.member_count, 0
  );

  if (loading) {
    return <div className="p-6 text-center">Cargando membresías...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Membresías</h1>
          <p className="text-muted-foreground">
            Gestiona los planes de membresía de Iron Wolf
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="iron" onClick={() => {
              setEditingMembership(null);
              setFormData({ name: "", description: "", price: "", duration_months: "", features: "", is_active: true });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Membresía
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMembership ? "Editar Membresía" : "Nueva Membresía"}
              </DialogTitle>
              <DialogDescription>
                {editingMembership 
                  ? "Actualiza los datos de la membresía."
                  : "Crea un nuevo plan de membresía para tus socios."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Plan</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (MXN)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (meses)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Características (separadas por comas)</Label>
                <Textarea
                  id="features"
                  placeholder="Ej: Acceso al gym, Clases grupales, Entrenador personal"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Plan activo</Label>
              </div>
              
              <Button type="submit" variant="iron" className="w-full">
                {editingMembership ? "Actualizar Plan" : "Crear Plan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Planes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberships.length}</div>
            <p className="text-xs text-muted-foreground">
              {memberships.filter(m => m.is_active).length} activos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Socios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Miembros activos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">
              MXN por mes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Más Popular</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {memberships.reduce((prev, current) => 
                prev.member_count > current.member_count ? prev : current
              ).name}
            </div>
            <p className="text-xs text-muted-foreground">
              {memberships.reduce((prev, current) => 
                prev.member_count > current.member_count ? prev : current
              ).member_count} socios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Memberships Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {memberships.map((membership) => (
          <Card key={membership.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{membership.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-primary">
                      ${membership.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {membership.duration_months === 0 
                        ? "/visita" 
                        : membership.duration_months === 1 
                        ? "/mes" 
                        : `/${membership.duration_months} meses`
                      }
                    </span>
                  </div>
                </div>
                <Badge variant={membership.is_active ? 'default' : 'secondary'}>
                  {membership.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {membership.description}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Incluye:</h4>
                <ul className="space-y-1">
                  {membership.features.map((feature, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-center">
                      <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Socios activos:</span>
                <span className="font-medium">{membership.member_count}</span>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(membership)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(membership.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
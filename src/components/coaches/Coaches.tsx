import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Star, Users, Calendar, Phone, Mail } from "lucide-react";

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  rating: number;
  clients_count: number;
  avatar_url?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export function Coaches() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialties: "",
  });

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      // Simulated data - replace with actual Supabase call
      const mockCoaches: Coach[] = [
        {
          id: "1",
          name: "Carlos Martínez",
          email: "carlos@ironwolf.com",
          phone: "+52 555 123 4567",
          specialties: ["Fuerza", "Powerlifting", "CrossFit"],
          rating: 4.8,
          clients_count: 32,
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Ana García",
          email: "ana@ironwolf.com",
          phone: "+52 555 987 6543",
          specialties: ["Yoga", "Pilates", "Flexibilidad"],
          rating: 4.9,
          clients_count: 28,
          status: "active",
          created_at: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Luis Fernández",
          email: "luis@ironwolf.com",
          phone: "+52 555 456 7890",
          specialties: ["Cardio", "Pérdida de peso", "Funcional"],
          rating: 4.7,
          clients_count: 25,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ];

      setCoaches(mockCoaches);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los coaches.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const coachData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialties: formData.specialties.split(",").map(s => s.trim()),
      rating: 5.0,
      clients_count: 0,
      status: "active" as const,
      created_at: new Date().toISOString(),
    };

    if (editingCoach) {
      // Update coach
      const updatedCoaches = coaches.map(coach => 
        coach.id === editingCoach.id 
          ? { ...coach, ...coachData }
          : coach
      );
      setCoaches(updatedCoaches);
      toast({
        title: "Coach actualizado",
        description: "Los datos del coach han sido actualizados correctamente.",
      });
    } else {
      // Add new coach
      const newCoach: Coach = {
        id: Date.now().toString(),
        ...coachData,
      };
      setCoaches([...coaches, newCoach]);
      toast({
        title: "Coach agregado",
        description: "El nuevo coach ha sido agregado correctamente.",
      });
    }

    setIsDialogOpen(false);
    setEditingCoach(null);
    setFormData({ name: "", email: "", phone: "", specialties: "" });
  };

  const handleEdit = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialties: coach.specialties.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (coachId: string) => {
    setCoaches(coaches.filter(coach => coach.id !== coachId));
    toast({
      title: "Coach eliminado",
      description: "El coach ha sido eliminado correctamente.",
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando coaches...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Coaches</h1>
          <p className="text-muted-foreground">
            Gestiona el equipo de entrenadores de Iron Wolf
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="iron" onClick={() => {
              setEditingCoach(null);
              setFormData({ name: "", email: "", phone: "", specialties: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Coach
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCoach ? "Editar Coach" : "Agregar Nuevo Coach"}
              </DialogTitle>
              <DialogDescription>
                {editingCoach 
                  ? "Actualiza la información del coach."
                  : "Completa los datos para agregar un nuevo coach al equipo."
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades (separadas por comas)</Label>
                <Input
                  id="specialties"
                  placeholder="Ej: Fuerza, CrossFit, Nutrición"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" variant="iron" className="w-full">
                {editingCoach ? "Actualizar Coach" : "Agregar Coach"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coaches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coaches.length}</div>
            <p className="text-xs text-muted-foreground">
              {coaches.filter(c => c.status === 'active').length} activos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {coaches.reduce((sum, coach) => sum + coach.clients_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio: {Math.round(coaches.reduce((sum, coach) => sum + coach.clients_count, 0) / coaches.length)} por coach
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(coaches.reduce((sum, coach) => sum + coach.rating, 0) / coaches.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              De 5.0 estrellas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coaches Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach) => (
          <Card key={coach.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={coach.avatar_url} />
                  <AvatarFallback className="bg-gradient-iron text-white">
                    {coach.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{coach.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{coach.rating}</span>
                  </div>
                </div>
                <Badge variant={coach.status === 'active' ? 'default' : 'secondary'}>
                  {coach.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{coach.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{coach.phone}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{coach.clients_count} clientes</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {coach.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(coach)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(coach.id)}
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
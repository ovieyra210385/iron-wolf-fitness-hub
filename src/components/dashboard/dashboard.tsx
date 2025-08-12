import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  Activity,
  Clock,
  MapPin,
  UserPlus,
  DollarSign,
  Zap
} from "lucide-react";
import heroImage from "@/assets/hero-gym.jpg";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-hero p-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Iron Wolf Gym" 
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">
                Bienvenido a Iron Wolf
              </h1>
              <p className="text-lg opacity-90 mb-4">
                Tu plataforma integral para gestión de gimnasios y centros deportivos
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Sistema Activo
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="w-3 h-3 mr-1" />
                  342 Socios Activos
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Acceso del día</p>
              <p className="text-2xl font-bold">89%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Socios Activos"
          value="342"
          description="Total de miembros activos"
          icon={Users}
          trend="up"
          trendValue="+12 este mes"
        />
        <StatCard
          title="Ingresos del Mes"
          value="$45,231"
          description="Ingresos de membresías y servicios"
          icon={DollarSign}
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard
          title="Clases Reservadas"
          value="168"
          description="Reservas para hoy"
          icon={Calendar}
          trend="neutral"
          trendValue="Estable"
        />
        <StatCard
          title="Canchas Ocupadas"
          value="3/6"
          description="Pickleball en uso"
          icon={MapPin}
          trend="neutral"
          trendValue="50% ocupación"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Actividad Reciente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas actividades en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Ana García",
                  action: "Check-in en Gym Principal",
                  time: "hace 5 min",
                  type: "checkin"
                },
                {
                  user: "Carlos López",
                  action: "Reservó clase de CrossFit",
                  time: "hace 12 min",
                  type: "booking"
                },
                {
                  user: "María Santos",
                  action: "Pago de membresía mensual",
                  time: "hace 18 min",
                  type: "payment"
                },
                {
                  user: "Roberto Ruiz",
                  action: "Nuevo registro de socio",
                  time: "hace 25 min",
                  type: "registration"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0">
                    {activity.type === "checkin" && (
                      <div className="h-8 w-8 rounded-full bg-fitness-energy/20 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-fitness-energy" />
                      </div>
                    )}
                    {activity.type === "booking" && (
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    {activity.type === "payment" && (
                      <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-accent" />
                      </div>
                    )}
                    {activity.type === "registration" && (
                      <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-secondary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Acceso directo a funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-iron hover:opacity-90" size="lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Registrar Nuevo Socio
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Gestionar Reservas
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <CreditCard className="mr-2 h-4 w-4" />
              Procesar Pago
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Reportes
            </Button>
          </CardContent>
        </Card>

        {/* Estado del Sistema */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Estado del Sistema
            </CardTitle>
            <CardDescription>
              Información en tiempo real de tu gimnasio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-fitness-energy">89%</div>
                <p className="text-sm text-muted-foreground">Capacidad Actual</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <p className="text-sm text-muted-foreground">Clases Activas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">24</div>
                <p className="text-sm text-muted-foreground">Entrenadores en Línea</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  Activity,
  Clock,
  Target,
  Award
} from "lucide-react";

export function Reports() {
  const monthlyStats = {
    revenue: { current: 45231, previous: 40235, growth: 12.4 },
    members: { current: 342, previous: 318, growth: 7.5 },
    visits: { current: 2847, previous: 2653, growth: 7.3 },
    retention: { current: 89.5, previous: 86.2, growth: 3.8 }
  };

  const topClasses = [
    { name: "CrossFit Matutino", participants: 145, revenue: 12650, growth: 15.2 },
    { name: "Yoga Vinyasa", participants: 89, revenue: 8010, growth: 8.7 },
    { name: "Spinning", participants: 134, revenue: 11740, growth: 12.1 },
    { name: "Pilates", participants: 67, revenue: 6030, growth: 5.4 },
    { name: "Funcional", participants: 98, revenue: 8820, growth: 9.8 }
  ];

  const membershipDistribution = [
    { plan: "Premium Anual", count: 89, percentage: 26.0, revenue: 799210 },
    { plan: "Premium Mensual", count: 156, percentage: 45.6, revenue: 140244 },
    { plan: "Básico Mensual", count: 87, percentage: 25.4, revenue: 52113 },
    { plan: "Pago por Visita", count: 10, percentage: 2.9, revenue: 2400 }
  ];

  const hourlyActivity = [
    { hour: "06:00", visits: 45 },
    { hour: "07:00", visits: 78 },
    { hour: "08:00", visits: 65 },
    { hour: "09:00", visits: 89 },
    { hour: "10:00", visits: 67 },
    { hour: "11:00", visits: 45 },
    { hour: "18:00", visits: 134 },
    { hour: "19:00", visits: 156 },
    { hour: "20:00", visits: 123 },
    { hour: "21:00", visits: 89 }
  ];

  const riskMembers = [
    { name: "Carmen Morales", lastVisit: "Hace 15 días", plan: "Premium Mensual", riskLevel: "Alto" },
    { name: "Luis Fernández", lastVisit: "Hace 12 días", plan: "Básico Mensual", riskLevel: "Medio" },
    { name: "Jorge Ramírez", lastVisit: "Hace 8 días", plan: "Premium Anual", riskLevel: "Medio" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Reportes y Analítica</h1>
          <p className="text-muted-foreground">Métricas de rendimiento, ingresos y análisis de retención</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="lg">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="iron" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Ingresos</h3>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-card-foreground">
                ${monthlyStats.revenue.current.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-fitness-energy">
                ↗ +{monthlyStats.revenue.growth}% vs mes anterior
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Socios Activos</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-card-foreground">
                {monthlyStats.members.current}
              </div>
              <div className="text-xs font-medium text-fitness-energy">
                ↗ +{monthlyStats.members.growth}% crecimiento
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Visitas del Mes</h3>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-card-foreground">
                {monthlyStats.visits.current.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-fitness-energy">
                ↗ +{monthlyStats.visits.growth}% más visitas
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium tracking-tight text-muted-foreground">Retención</h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-card-foreground">
                {monthlyStats.retention.current}%
              </div>
              <div className="text-xs font-medium text-fitness-energy">
                ↗ +{monthlyStats.retention.growth}% mejora
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Clases Más Populares
            </CardTitle>
            <CardDescription>Rendimiento por tipo de clase este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium text-card-foreground">{classItem.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{classItem.participants} participantes</span>
                      <span>•</span>
                      <span className="text-fitness-energy">+{classItem.growth}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-card-foreground">
                      ${classItem.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Membership Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Membresías</CardTitle>
            <CardDescription>Análisis por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {membershipDistribution.map((membership, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">{membership.plan}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">{membership.count} socios</span>
                      <p className="text-xs text-muted-foreground">{membership.percentage}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-iron h-2 rounded-full transition-all duration-300"
                      style={{ width: `${membership.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ingresos: ${membership.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Actividad por Hora
            </CardTitle>
            <CardDescription>Distribución de visitas durante el día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hourlyActivity.map((hour, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium w-16 text-card-foreground">{hour.hour}</span>
                  <div className="flex-1 bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(hour.visits / 156) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{hour.visits}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Análisis de Riesgo de Baja
            </CardTitle>
            <CardDescription>Socios que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskMembers.map((member, index) => (
                <div key={index} className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-card-foreground">{member.name}</h4>
                    <Badge
                      className={
                        member.riskLevel === "Alto" 
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-accent text-accent-foreground"
                      }
                    >
                      {member.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{member.plan}</p>
                  <p className="text-xs text-destructive font-medium">{member.lastVisit}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Análisis Completo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Reportes</CardTitle>
          <CardDescription>Exportación de datos y análisis personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Reporte Financiero
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Análisis de Socios
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Reporte de Asistencia
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Análisis de Retención
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
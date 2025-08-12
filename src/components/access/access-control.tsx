import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  QrCode, 
  Fingerprint, 
  Camera,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Activity,
  AlertCircle,
  Key
} from "lucide-react";

export function AccessControl() {
  const accessMethods = [
    {
      method: "Código QR",
      icon: QrCode,
      active: true,
      description: "Acceso mediante código QR generado en la app móvil",
      usage: "85%",
      color: "text-primary"
    },
    {
      method: "Huella Digital",
      icon: Fingerprint,
      active: true,
      description: "Lectura biométrica de huella dactilar",
      usage: "12%",
      color: "text-fitness-energy"
    },
    {
      method: "Tarjeta RFID",
      icon: CreditCard,
      active: false,
      description: "Tarjetas de proximidad RFID",
      usage: "2%",
      color: "text-muted-foreground"
    },
    {
      method: "Reconocimiento Facial",
      icon: Camera,
      active: false,
      description: "Identificación por reconocimiento facial",
      usage: "1%",
      color: "text-accent"
    }
  ];

  const recentAccess = [
    {
      id: 1,
      member: "Ana García",
      method: "QR Code",
      time: "09:45",
      status: "Autorizado",
      area: "Gym Principal"
    },
    {
      id: 2,
      member: "Carlos López",
      method: "Huella",
      time: "09:42",
      status: "Autorizado",
      area: "Área Cardio"
    },
    {
      id: 3,
      member: "Usuario Desconocido",
      method: "QR Code",
      time: "09:38",
      status: "Denegado",
      area: "Entrada Principal"
    },
    {
      id: 4,
      member: "María Santos",
      method: "QR Code",
      time: "09:35",
      status: "Autorizado",
      area: "Cancha Pickleball 1"
    },
    {
      id: 5,
      member: "Roberto Ruiz",
      method: "Huella",
      time: "09:30",
      status: "Autorizado",
      area: "Sala CrossFit"
    }
  ];

  const accessAreas = [
    { area: "Entrada Principal", status: "Activo", members: 45, capacity: 120 },
    { area: "Gym Principal", status: "Activo", members: 32, capacity: 80 },
    { area: "Área Cardio", status: "Activo", members: 18, capacity: 30 },
    { area: "Sala CrossFit", status: "Activo", members: 12, capacity: 15 },
    { area: "Cancha Pickleball 1", status: "Activo", members: 4, capacity: 8 },
    { area: "Cancha Pickleball 2", status: "Mantenimiento", members: 0, capacity: 8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Autorizado":
      case "Activo":
        return "bg-fitness-energy text-fitness-dark";
      case "Denegado":
        return "bg-destructive text-destructive-foreground";
      case "Mantenimiento":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Autorizado":
        return <CheckCircle className="h-4 w-4 text-fitness-energy" />;
      case "Denegado":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Control de Acceso</h1>
          <p className="text-muted-foreground">Sistemas de seguridad y monitoreo de acceso en tiempo real</p>
        </div>
        <Button variant="iron" size="lg">
          <Shield className="mr-2 h-4 w-4" />
          Configurar Acceso
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Accesos Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-fitness-energy" />
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-muted-foreground">Tasa de Autorización</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">111</p>
                <p className="text-xs text-muted-foreground">Personas Dentro</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Accesos Denegados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Access Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Acceso</CardTitle>
            <CardDescription>Sistemas de identificación disponibles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${method.color}`} />
                    <div>
                      <h3 className="font-medium text-card-foreground">{method.method}</h3>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={method.active ? "bg-fitness-energy text-fitness-dark" : "bg-muted text-muted-foreground"}>
                      {method.active ? "Activo" : "Inactivo"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{method.usage}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Access Log */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Acceso</CardTitle>
            <CardDescription>Actividad reciente en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAccess.map((access) => (
                <div key={access.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(access.status)}
                    <div>
                      <h4 className="font-medium text-sm text-card-foreground">{access.member}</h4>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{access.time}</span>
                        <span>•</span>
                        <span>{access.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(access.status)}>
                      {access.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{access.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Area Status */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Áreas</CardTitle>
            <CardDescription>Ocupación y control por zona</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessAreas.map((area, index) => (
              <div key={index} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-card-foreground">{area.area}</h4>
                  <Badge className={getStatusColor(area.status)}>
                    {area.status}
                  </Badge>
                </div>
                {area.status === "Activo" && (
                  <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Ocupación:</span>
                      <span>{area.members}/{area.capacity} personas</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (area.members / area.capacity) > 0.8 
                            ? "bg-destructive" 
                            : (area.members / area.capacity) > 0.6 
                              ? "bg-accent" 
                              : "bg-fitness-energy"
                        }`}
                        style={{ width: `${(area.members / area.capacity) * 100}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Seguridad</CardTitle>
          <CardDescription>Configuración y monitoreo del sistema de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <QrCode className="h-6 w-6 mb-2" />
              Generar QR Temporal
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Fingerprint className="h-6 w-6 mb-2" />
              Registrar Huella
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Key className="h-6 w-6 mb-2" />
              Gestionar Permisos
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Monitoreo en Vivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
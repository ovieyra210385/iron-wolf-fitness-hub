import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send,
  Users,
  Filter,
  Search,
  Plus,
  Calendar,
  Target,
  TrendingUp,
  Star,
  Clock,
  CheckCircle
} from "lucide-react";

export function CRM() {
  const clients = [
    {
      id: 1,
      name: "Ana García Rodríguez",
      email: "ana.garcia@email.com",
      phone: "+52 55 1234-5678",
      status: "Activo",
      lastContact: "Hace 2 días",
      segment: "Premium",
      visits: 45,
      nextAction: "Renovación en 15 días"
    },
    {
      id: 2,
      name: "Carlos López Hernández", 
      email: "carlos.lopez@email.com",
      phone: "+52 55 2345-6789",
      status: "Prospecto",
      lastContact: "Hace 1 semana",
      segment: "Interesado",
      visits: 0,
      nextAction: "Llamada de seguimiento"
    },
    {
      id: 3,
      name: "María Santos Díaz",
      email: "maria.santos@email.com",
      phone: "+52 55 3456-7890",
      status: "En Riesgo",
      lastContact: "Hace 15 días",
      segment: "Premium",
      visits: 28,
      nextAction: "Reactivación urgente"
    },
    {
      id: 4,
      name: "Roberto Ruiz Martín",
      email: "roberto.ruiz@email.com",
      phone: "+52 55 4567-8901",
      status: "Activo",
      lastContact: "Ayer",
      segment: "Básico",
      visits: 8,
      nextAction: "Upsell a Premium"
    }
  ];

  const campaigns = [
    {
      name: "Promoción Verano 2024",
      type: "Email",
      status: "Activa",
      sent: 342,
      opened: 156,
      clicked: 89,
      converted: 23
    },
    {
      name: "Recordatorio Renovación",
      type: "WhatsApp",
      status: "Programada",
      sent: 45,
      opened: 38,
      clicked: 12,
      converted: 8
    },
    {
      name: "Bienvenida Nuevos Socios",
      type: "SMS",
      status: "Activa",
      sent: 12,
      opened: 12,
      clicked: 8,
      converted: 5
    }
  ];

  const quickMessages = [
    {
      template: "Renovación Próxima",
      message: "¡Hola! Tu membresía vence pronto. Renueva ahora con 15% de descuento.",
      channel: "WhatsApp"
    },
    {
      template: "Reactivación",
      message: "Te extrañamos en Iron Wolf. Regresa con una clase gratis.",
      channel: "Email"
    },
    {
      template: "Promoción Especial",
      message: "Oferta exclusiva: 50% desc. en tu primera consulta nutricional.",
      channel: "SMS"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-fitness-energy text-fitness-dark";
      case "Prospecto":
        return "bg-primary text-primary-foreground";
      case "En Riesgo":
        return "bg-destructive text-destructive-foreground";
      case "Inactivo":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "Premium":
        return "bg-accent text-accent-foreground";
      case "Básico":
        return "bg-secondary text-secondary-foreground";
      case "Interesado":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">CRM y Comunicación</h1>
          <p className="text-muted-foreground">Gestión de clientes y comunicación automatizada</p>
        </div>
        <Button variant="iron" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Campaña
        </Button>
      </div>

      {/* CRM Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Contactos Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-fitness-energy" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">Leads Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Mensajes Enviados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">23.5%</p>
                <p className="text-xs text-muted-foreground">Tasa de Conversión</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Client List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Base de Clientes</CardTitle>
                <CardDescription>Gestión de contactos y seguimiento</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar cliente..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-iron rounded-full flex items-center justify-center text-white font-bold">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{client.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {client.email}
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {client.phone}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{client.nextAction}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex space-x-1">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                      <Badge className={getSegmentColor(client.segment)}>
                        {client.segment}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {client.visits} visitas
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.lastContact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Mensajes Rápidos</CardTitle>
            <CardDescription>Templates predefinidos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickMessages.map((template, index) => (
              <div key={index} className="p-3 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-card-foreground">{template.template}</h4>
                  <Badge variant="outline">{template.channel}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{template.message}</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Send className="h-3 w-3 mr-1" />
                  Enviar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Campañas de Marketing
          </CardTitle>
          <CardDescription>Comunicación automatizada y promociones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-card-foreground">{campaign.name}</h3>
                  <Badge className={campaign.status === "Activa" ? "bg-fitness-energy text-fitness-dark" : "bg-primary text-primary-foreground"}>
                    {campaign.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Canal:</span>
                    <span className="font-medium">{campaign.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Enviados:</span>
                    <span className="font-medium">{campaign.sent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Abiertos:</span>
                    <span className="font-medium">{campaign.opened}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Clics:</span>
                    <span className="font-medium">{campaign.clicked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Conversiones:</span>
                    <span className="font-medium text-fitness-energy">{campaign.converted}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Tasa de conversión: {((campaign.converted / campaign.sent) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CRM Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Herramientas de Comunicación</CardTitle>
          <CardDescription>Acciones rápidas para gestión de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <Mail className="h-6 w-6 mb-2" />
              Enviar Email Masivo
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MessageSquare className="h-6 w-6 mb-2" />
              WhatsApp Business
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Phone className="h-6 w-6 mb-2" />
              Campañas SMS
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              Segmentación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
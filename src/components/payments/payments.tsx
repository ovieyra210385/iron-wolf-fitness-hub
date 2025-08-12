import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export function Payments() {
  const payments = [
    {
      id: "PAY-001",
      member: "Ana García Rodríguez",
      amount: 899,
      concept: "Membresía Premium Mensual",
      method: "Tarjeta de Crédito",
      status: "Completado",
      date: "2024-08-12 09:30",
      invoice: "FAC-2024-001"
    },
    {
      id: "PAY-002",
      member: "Carlos López Hernández",
      amount: 80,
      concept: "Pago por Visita",
      method: "Efectivo",
      status: "Completado",
      date: "2024-08-12 08:45",
      invoice: "TIC-2024-089"
    },
    {
      id: "PAY-003",
      member: "María Santos Díaz",
      amount: 599,
      concept: "Membresía Básica Mensual",
      method: "SPEI",
      status: "Pendiente",
      date: "2024-08-12 07:20",
      invoice: "FAC-2024-002"
    },
    {
      id: "PAY-004",
      member: "Roberto Ruiz Martín",
      amount: 200,
      concept: "Renta Cancha Pickleball",
      method: "CoDi",
      status: "Completado",
      date: "2024-08-11 19:15",
      invoice: "TIC-2024-088"
    }
  ];

  const paymentMethods = [
    { name: "Tarjeta de Crédito/Débito", count: 156, percentage: 45.2 },
    { name: "SPEI", count: 89, percentage: 25.8 },
    { name: "Efectivo", count: 67, percentage: 19.4 },
    { name: "CoDi", count: 33, percentage: 9.6 }
  ];

  const pendingPayments = [
    { member: "Luis Fernández", amount: 899, daysOverdue: 3, plan: "Premium Mensual" },
    { member: "Carmen Morales", amount: 599, daysOverdue: 7, plan: "Básico Mensual" },
    { member: "Jorge Ramírez", amount: 8990, daysOverdue: 1, plan: "Premium Anual" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-fitness-energy text-fitness-dark";
      case "Pendiente":
        return "bg-accent text-accent-foreground";
      case "Fallido":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado":
        return <CheckCircle className="h-4 w-4 text-fitness-energy" />;
      case "Pendiente":
        return <Clock className="h-4 w-4 text-accent" />;
      case "Fallido":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Pagos y Facturación</h1>
          <p className="text-muted-foreground">Gestión de cobros, métodos de pago y facturación electrónica</p>
        </div>
        <Button variant="iron" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
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
              <TrendingUp className="h-8 w-8 text-fitness-energy" />
              <div>
                <p className="text-2xl font-bold">+12.5%</p>
                <p className="text-xs text-muted-foreground">vs. Mes Anterior</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">234</p>
                <p className="text-xs text-muted-foreground">Facturas Emitidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Pagos Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pagos Recientes</CardTitle>
                <CardDescription>Últimas transacciones procesadas</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar pago..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h3 className="font-medium text-card-foreground">{payment.member}</h3>
                      <p className="text-sm text-muted-foreground">{payment.concept}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{payment.date}</span>
                        <span>•</span>
                        <span>{payment.method}</span>
                        <span>•</span>
                        <span>{payment.invoice}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-card-foreground">
                      ${payment.amount.toLocaleString()}
                    </p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods & Pending */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Distribución de transacciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-card-foreground">{method.name}</span>
                    <span className="text-muted-foreground">{method.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{method.count} transacciones</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Pagos Pendientes</CardTitle>
              <CardDescription>Requieren seguimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingPayments.map((pending, index) => (
                <div key={index} className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-card-foreground">{pending.member}</h4>
                    <span className="text-sm font-bold text-destructive">
                      ${pending.amount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{pending.plan}</p>
                  <p className="text-xs text-destructive font-medium">
                    {pending.daysOverdue} {pending.daysOverdue === 1 ? 'día' : 'días'} de retraso
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pagos</CardTitle>
          <CardDescription>Acciones rápidas para procesar pagos y facturación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Procesar Pago
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Receipt className="h-6 w-6 mb-2" />
              Generar Factura
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Configurar Cobro Recurrente
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Download className="h-6 w-6 mb-2" />
              Exportar Reporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
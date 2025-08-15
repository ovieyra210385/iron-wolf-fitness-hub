// src/components/dashboard/dashboard.tsx

import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, Users, DollarSign, MapPin, CreditCard, Activity, Clock, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-gym.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { POS } from "@/components/pos/pos";
import { Settings } from "@/components/settings/settings";

import { MembershipChart } from "./MembershipChart";
import { ActivityChart } from "./ActivityChart";

export function Dashboard() {
  // Estado para el rango de fechas (últimos 7 días por defecto)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Panel de notificaciones
  const [notifications, setNotifications] = useState([
    { type: "pago", message: "Pago pendiente de Luis Fernández (Premium Mensual)", time: "hace 2h" },
    { type: "reserva", message: "Nueva reserva de cancha Pickleball por Ana García", time: "hace 30min" },
    { type: "vencimiento", message: "Membresía de Carlos López vence en 3 días", time: "hace 10min" },
    { type: "promocion", message: "Promoción activa: 15% en renovaciones", time: "hace 1h" }
  ]);

  // Estado de slots de Pickleball
  const [pickleballSlots, setPickleballSlots] = useState([
    { hour: "08:00", available: true },
    { hour: "09:00", available: false },
    { hour: "10:00", available: true },
    { hour: "11:00", available: true },
    { hour: "12:00", available: false },
    { hour: "13:00", available: true }
  ]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Simula reserva y pago
  const handleReserve = (slotIndex: number) => {
    setSelectedSlot(slotIndex);
    setShowDialog(true);
  };
  
  const handleConfirmPayment = () => {
    setPaymentDone(true);
    setPickleballSlots((slots) =>
      slots.map((s, i) => i === selectedSlot ? { ...s, available: false } : s)
    );
    setNotifications((prev) => [
      { type: "reserva", message: `Reserva confirmada de cancha Pickleball a las ${selectedSlot !== null ? pickleballSlots[selectedSlot].hour : ''}`, time: "ahora" },
      ...prev
    ]);
    setTimeout(() => {
      setShowDialog(false);
      setPaymentDone(false);
      setSelectedSlot(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section con Selector de Fechas */}
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
                  <Zap className="w-3 h-3 mr-1" /> Sistema Activo
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Users className="w-3 h-3 mr-1" /> 342 Socios Activos
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {/* Selector de Fechas */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[280px] justify-start text-left font-normal mb-2"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Selecciona un rango</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-right">
                <p className="text-sm opacity-75">Acceso del día</p>
                <p className="text-2xl font-bold">89%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Socios Activos" value="342" icon={Users} trend="up" trendValue="+12 este mes" />
        <StatCard title="Ingresos del Mes" value="$45,231" icon={DollarSign} trend="up" trendValue="+8.2%" />
        <StatCard title="Clases Reservadas" value="168" icon={Calendar} trend="neutral" trendValue="Estable" />
        <StatCard title="Canchas Ocupadas" value="3/6" icon={MapPin} trend="neutral" trendValue="50% ocupación" />
      </div>

      {/* Sección de Gráficos */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráfico de actividad con rango de fechas */}
        <div className="lg:col-span-2">
          <ActivityChart dateRange={dateRange} />
        </div>

        {/* Gráfico de membresías con rango de fechas */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Membresías</CardTitle>
            <CardDescription className="text-xs">Distribución de socios por plan.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center pb-6">
            <MembershipChart dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>

      {/* Panel de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones y Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="font-medium text-card-foreground">{n.message}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accesos directos a módulos */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <Button variant="iron" className="h-20 flex-col">
          <Users className="h-6 w-6 mb-2" />
          Socios y Membresías
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <CreditCard className="h-6 w-6 mb-2" />
          Pagos y Facturación
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Calendar className="h-6 w-6 mb-2" />
          Reservas y Clases
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Activity className="h-6 w-6 mb-2" />
          CRM y Comunicación
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Shield className="h-6 w-6 mb-2" />
          Control de Acceso
        </Button>
      </div>

      {/* Widget Renta de Cancha Pickleball */}
      <Card>
        <CardHeader>
          <CardTitle>Renta de Cancha Pickleball</CardTitle>
          <CardDescription>Reserva tu espacio por hora</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {pickleballSlots.map((slot, i) => (
              <div key={i} className={`p-4 rounded-lg border flex flex-col items-center justify-center ${slot.available ? 'bg-fitness-energy/10' : 'bg-muted/50'}`}>
                <span className="text-lg font-bold">{slot.hour}</span>
                <span className="text-xs mb-2">{slot.available ? 'Disponible' : 'Ocupado'}</span>
                <Button disabled={!slot.available} variant={slot.available ? 'iron' : 'outline'} size="sm" onClick={() => handleReserve(i)}>
                  Reservar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación de reserva y pago */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              {paymentDone
                ? "¡Reserva y pago realizados con éxito!"
                : `¿Deseas reservar la cancha a las ${selectedSlot !== null ? pickleballSlots[selectedSlot].hour : ''}? El pago se procesará automáticamente.`}
            </DialogDescription>
          </DialogHeader>
          {!paymentDone && (
            <Button variant="iron" className="w-full" onClick={handleConfirmPayment}>
              Confirmar y Pagar
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Estado del Sistema */}
      <Card>
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

      {/* POS integrado */}
      <div className="mt-8">
        <POS />
      </div>
      
      {/* Settings integrado */}
      <div className="mt-8">
        <Settings />
      </div>
    </div>
  );
}
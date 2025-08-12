import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export function Bookings() {
  const todayBookings = [
    {
      id: 1,
      className: "CrossFit Matutino",
      instructor: "Carlos Mendoza",
      time: "06:00 - 07:00",
      participants: 12,
      capacity: 15,
      room: "Sala CrossFit",
      status: "Confirmada"
    },
    {
      id: 2,
      className: "Yoga Vinyasa",
      instructor: "Ana Martínez",
      time: "08:30 - 09:30",
      participants: 8,
      capacity: 12,
      room: "Sala de Yoga",
      status: "Confirmada"
    },
    {
      id: 3,
      className: "Spinning",
      instructor: "Roberto Silva",
      time: "18:00 - 19:00",
      participants: 20,
      capacity: 20,
      room: "Sala de Spinning",
      status: "Llena"
    },
    {
      id: 4,
      className: "Pilates",
      instructor: "María González",
      time: "19:30 - 20:30",
      participants: 6,
      capacity: 15,
      room: "Sala de Pilates",
      status: "Disponible"
    }
  ];

  const pickleballCourts = [
    {
      court: 1,
      timeSlots: [
        { time: "08:00-09:00", status: "Ocupada", customer: "Juan Pérez", price: 200 },
        { time: "09:00-10:00", status: "Disponible", customer: null, price: 200 },
        { time: "10:00-11:00", status: "Reservada", customer: "Ana García", price: 200 },
        { time: "11:00-12:00", status: "Disponible", customer: null, price: 200 }
      ]
    },
    {
      court: 2,
      timeSlots: [
        { time: "08:00-09:00", status: "Disponible", customer: null, price: 200 },
        { time: "09:00-10:00", status: "Ocupada", customer: "Carlos López", price: 200 },
        { time: "10:00-11:00", status: "Disponible", customer: null, price: 200 },
        { time: "11:00-12:00", status: "Mantenimiento", customer: null, price: 0 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmada":
      case "Ocupada":
        return <CheckCircle className="h-4 w-4 text-fitness-energy" />;
      case "Llena":
      case "Reservada":
        return <AlertCircle className="h-4 w-4 text-accent" />;
      case "Cancelada":
      case "Mantenimiento":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
      case "Ocupada":
        return "bg-fitness-energy text-fitness-dark";
      case "Llena":
      case "Reservada":
        return "bg-accent text-accent-foreground";
      case "Disponible":
        return "bg-secondary text-secondary-foreground";
      case "Cancelada":
      case "Mantenimiento":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Reservas y Programación</h1>
          <p className="text-muted-foreground">Gestión de clases, espacios y canchas de pickleball</p>
        </div>
        <Button variant="iron" size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reserva
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">168</p>
                <p className="text-xs text-muted-foreground">Reservas Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-fitness-energy" />
              <div>
                <p className="text-2xl font-bold">3/6</p>
                <p className="text-xs text-muted-foreground">Canchas Ocupadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Ocupación Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-muted-foreground">Lista de Espera</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clases de Hoy</CardTitle>
                <CardDescription>Programación y asistencia</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(booking.status)}
                    <div>
                      <h3 className="font-medium text-card-foreground">{booking.className}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{booking.time}</span>
                        <MapPin className="h-3 w-3 ml-2" />
                        <span>{booking.room}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Instructor: {booking.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {booking.participants}/{booking.capacity} personas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pickleball Courts */}
        <Card>
          <CardHeader>
            <CardTitle>Canchas de Pickleball</CardTitle>
            <CardDescription>Disponibilidad y reservas por hora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pickleballCourts.map((court) => (
                <div key={court.court} className="space-y-3">
                  <h3 className="font-medium text-card-foreground">Cancha {court.court}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {court.timeSlots.map((slot, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border text-sm ${
                          slot.status === "Disponible" 
                            ? "border-secondary bg-secondary/10 cursor-pointer hover:bg-secondary/20" 
                            : "border-border bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{slot.time}</span>
                          <Badge className={getStatusColor(slot.status)}>
                            {slot.status}
                          </Badge>
                        </div>
                        {slot.customer && (
                          <p className="text-xs text-muted-foreground">
                            {slot.customer}
                          </p>
                        )}
                        {slot.price > 0 && (
                          <p className="text-xs font-medium text-primary">
                            ${slot.price}/hora
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Reservas</CardTitle>
          <CardDescription>Acciones rápidas para administrar reservas y espacios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="iron" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Nueva Clase
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <MapPin className="h-6 w-6 mb-2" />
              Reservar Cancha
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gestionar Lista de Espera
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              Programar Semana
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
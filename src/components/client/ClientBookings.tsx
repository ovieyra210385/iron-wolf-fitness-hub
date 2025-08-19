// src/pages/client/ClientBookings.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { Clock, Users, Loader2, CheckCircle } from "lucide-react";

export default function ClientBookings() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({}); // Para manejar el estado de cada botón

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    // Hacemos un JOIN para traer los detalles de la clase junto con el horario
    const { data, error } = await supabase
      .from('class_schedule')
      .select(`
        id,
        start_time,
        day_of_week,
        class:classes (
          id,
          name,
          trainer_name,
          max_capacity
        )
      `)
      .order('day_of_week').order('start_time');
    
    if (error) console.error("Error fetching schedules:", error);
    else setSchedules(data || []);
    setLoading(false);
  };

  const handleBooking = async (scheduleId) => {
    setBookingStatus(prev => ({...prev, [scheduleId]: 'loading'}));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Necesitas iniciar sesión para reservar.");
      setBookingStatus(prev => ({...prev, [scheduleId]: null}));
      return;
    }

    const { error } = await supabase.from('bookings').insert({
      member_id: user.id,
      schedule_id: scheduleId,
      booking_date: new Date().toISOString().split('T')[0], // La reserva es para el día de hoy
    });

    if (error) {
      // El código '23505' es de violación de restricción única (significa que ya reservó)
      if (error.code === '23505') {
        alert("Ya tienes una reserva para esta clase hoy.");
        setBookingStatus(prev => ({...prev, [scheduleId]: 'booked'}));
      } else {
        alert("Hubo un error al realizar la reserva.");
        console.error(error);
      }
    } else {
      alert("¡Reserva confirmada!");
      setBookingStatus(prev => ({...prev, [scheduleId]: 'booked'}));
    }
  };

  const daysOfWeek = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-heading font-bold">Reservar una Clase</h1>
      <p className="text-muted-foreground">Consulta los horarios y asegura tu lugar en las próximas clases.</p>

      {loading ? <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div> : 
       schedules.map(schedule => (
        <Card key={schedule.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <Badge>{daysOfWeek[schedule.day_of_week]}</Badge>
              <h3 className="text-lg font-bold mt-1">{schedule.class.name}</h3>
              <p className="text-sm text-muted-foreground">con {schedule.class.trainer_name}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" />{new Date(schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</span>
                <span className="flex items-center"><Users className="mr-1.5 h-4 w-4" />{schedule.class.max_capacity} lugares</span>
              </div>
            </div>
            <div>
              {bookingStatus[schedule.id] === 'booked' ? (
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Reservado
                </div>
              ) : (
                <Button 
                  onClick={() => handleBooking(schedule.id)}
                  disabled={bookingStatus[schedule.id] === 'loading'}
                >
                  {bookingStatus[schedule.id] === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reservar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
       ))
      }
    </div>
  );
}
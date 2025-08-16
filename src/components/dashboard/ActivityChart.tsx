// src/components/dashboard/ActivityChart.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { supabase } from '@/lib/supabaseClient'; // Importamos supabase
import { subDays } from 'date-fns'; // Utilidad para manejar fechas

const chartConfig = {
    visits: { label: "Visitas", color: "hsl(var(--primary))" },
};

// El componente ahora acepta un rango de fechas opcional
export function ActivityChart({ dateRange }: { dateRange?: any }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      // Si no hay rango de fechas, usamos los últimos 7 días por defecto
      const from = dateRange?.from || subDays(new Date(), 7);
      const to = dateRange?.to || new Date();

      // Aquí harías una llamada a Supabase para obtener los datos agregados
      // Por ahora, simularemos la carga y mostraremos datos de ejemplo
      // TO-DO: Reemplazar con una llamada a una RPC de Supabase que agrupe las visitas por día/hora
      const mockData = [
          { date: 'Lun', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Mar', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Mié', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Jue', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Vie', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Sáb', visits: Math.floor(Math.random() * 100) + 50 },
          { date: 'Dom', visits: Math.floor(Math.random() * 100) + 50 },
      ];
      setData(mockData);
      setLoading(false);
    };

    fetchActivity();
  }, [dateRange]); // El gráfico se recargará cada vez que el rango de fechas cambie

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad y Horas Pico</CardTitle>
        <CardDescription>Visitas de socios en el período seleccionado.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          {loading ? <p>Cargando datos...</p> :
           <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
           </BarChart>
          }
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
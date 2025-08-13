// src/components/members/ActivityCard.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { TrendingUp, Footprints } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityCardProps {
  memberId: string;
}

export function ActivityCard({ memberId }: ActivityCardProps) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!memberId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('member_activity')
        .select('steps, calories_burned')
        .eq('member_id', memberId)
        .eq('date', today)
        .single(); // Traemos solo la entrada de hoy

      setActivity(data);
      setLoading(false);
    };

    fetchActivity();
  }, [memberId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Sincronizada de Hoy</CardTitle>
        <CardDescription>Datos obtenidos de servicios conectados como Google Fit.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : activity ? (
          <div className="flex items-center space-x-8 text-2xl font-bold">
            <div className="flex items-center">
              <Footprints className="h-6 w-6 mr-3 text-blue-500"/>
              <div>
                <p>{activity.steps?.toLocaleString() || 0}</p>
                <p className="text-sm font-normal text-muted-foreground">Pasos</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No hay datos de actividad sincronizados para hoy.</p>
        )}
      </CardContent>
    </Card>
  );
}
// src/components/members/MemberAchievements.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import * as LucideIcons from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from '@/components/ui/skeleton';

interface MemberAchievementsProps {
  memberId: string;
}

export function MemberAchievements({ memberId }: MemberAchievementsProps) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;

    const fetchAchievements = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('member_achievements')
        .select(`
          unlocked_at,
          achievements (
            name,
            description,
            icon_name,
            points
          )
        `)
        .eq('member_id', memberId)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error("Error fetching achievements:", error);
      } else {
        setAchievements(data || []);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, [memberId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logros Desbloqueados</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-20 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logros Desbloqueados</CardTitle>
        <CardDescription>
          Medallas obtenidas por el socio a través de su esfuerzo y constancia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <TooltipProvider>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {achievements.map((item, index) => {
                const achievement = item.achievements;
                const IconComponent = LucideIcons[achievement.icon_name] || LucideIcons['Trophy'];
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center justify-center p-2 border rounded-lg bg-gradient-iron text-white aspect-square transition-transform hover:scale-110 cursor-pointer">
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{achievement.name}</p>
                      <p>{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Desbloqueado: {new Date(item.unlocked_at).toLocaleDateString()}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
         ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Este socio aún no ha desbloqueado ningún logro.</p>
          </div>
         )
        }
      </CardContent>
    </Card>
  );
}
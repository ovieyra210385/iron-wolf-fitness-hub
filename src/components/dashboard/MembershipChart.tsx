// src/components/dashboard/MembershipChart.tsx

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Datos de ejemplo, similares a los que ya tienes en tus reportes.
// En una aplicación real, estos datos vendrían de una llamada a tu API/Supabase.
const membershipData = [
    { plan: "Premium Anual", count: 89, fill: "var(--color-premium)" },
    { plan: "Premium Mensual", count: 156, fill: "var(--color-premium-mensual)" },
    { plan: "Básico Mensual", count: 87, fill: "var(--color-basico)" },
    { plan: "Pago por Visita", count: 10, fill: "var(--color-visita)" },
];

// Configuración para el estilo y la leyenda del gráfico
const chartConfig = {
    count: {
        label: "Socios",
    },
    premium: {
        label: "Premium Anual",
        color: "hsl(var(--chart-1))",
    },
    "premium-mensual": {
        label: "Premium Mensual",
        color: "hsl(var(--chart-2))",
    },
    basico: {
        label: "Básico Mensual",
        color: "hsl(var(--chart-3))",
    },
    visita: {
        label: "Pago por Visita",
        color: "hsl(var(--chart-4))",
    },
};

export function MembershipChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribución de Membresías</CardTitle>
                <CardDescription>Porcentaje de socios por tipo de plan activo.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[250px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={membershipData}
                                dataKey="count"
                                nameKey="plan"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                {membershipData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { chartConfig } from '../constants';
import type { FunnelDistribution } from '../types';

interface FunnelPieChartProps {
  data: FunnelDistribution[];
}

export function FunnelPieChart({ data }: FunnelPieChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5" />
          Distribuição por Funil
        </CardTitle>
        <CardDescription>
          Proporção de oportunidades em cada funil de vendas
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="mx-auto"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

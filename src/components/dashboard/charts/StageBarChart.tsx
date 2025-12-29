import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { FUNNEL_CONFIG } from '../constants';
import { formatNumber } from '../utils/formatters';
import type { StageData, FunnelFilter } from '../types';

interface StageBarChartProps {
  data: StageData[];
  selectedFunnel: FunnelFilter;
  totalOpportunities: number;
}

export function StageBarChart({ data, selectedFunnel, totalOpportunities }: StageBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Oportunidades por Estágio
            </CardTitle>
            <CardDescription className="mt-2">
              Distribuição das oportunidades nos diferentes estágios do funil
              {selectedFunnel !== 'all' && ` - ${FUNNEL_CONFIG[selectedFunnel].label}`}
            </CardDescription>
          </div>
          <Badge className={`bg-linear-to-r ${FUNNEL_CONFIG[selectedFunnel].gradient} text-white`}>
            {formatNumber(totalOpportunities)} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer 
          config={{
            count: {
              label: "Quantidade",
              color: FUNNEL_CONFIG[selectedFunnel].color,
            },
          }}
          className="aspect-auto h-112.5 w-full"
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="stroke-muted" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => `Estágio: ${value}`}
                  formatter={(value: any, name: string | number) => {
                    if (name === 'count') return [formatNumber(value), ' Qtde'];
                    return [value, name];
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill={FUNNEL_CONFIG[selectedFunnel].color}
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

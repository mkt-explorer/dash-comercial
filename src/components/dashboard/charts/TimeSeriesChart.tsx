import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { AreaChart, Area, CartesianGrid, XAxis } from 'recharts';
import { chartConfig } from '../constants';
import type { TimeSeriesData } from '../types';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Crescimento do Pipeline
          </CardTitle>
          <CardDescription className="mt-2">
            Evolução consolidada de todos os funis de oportunidades nos últimos 30 dias
          </CardDescription>
        </div>
        <Badge variant="outline" className="font-semibold">
          Últimos 30 dias
        </Badge>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-100 w-full">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="fillOpportunities" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-opportunities)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-opportunities)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExplorerBc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-explorerBc)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-explorerBc)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-dot)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-dot)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOrgaoPublico" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orgaoPublico)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-orgaoPublico)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="opportunities"
              type="monotone"
              fill="url(#fillOpportunities)"
              stroke="var(--color-opportunities)"
              strokeWidth={2}
            />
            <Area
              dataKey="explorerBc"
              type="monotone"
              fill="url(#fillExplorerBc)"
              stroke="var(--color-explorerBc)"
              strokeWidth={2}
            />
            <Area
              dataKey="dot"
              type="monotone"
              fill="url(#fillDot)"
              stroke="var(--color-dot)"
              strokeWidth={2}
            />
            <Area
              dataKey="orgaoPublico"
              type="monotone"
              fill="url(#fillOrgaoPublico)"
              stroke="var(--color-orgaoPublico)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from './utils/formatters';
import type { FunnelDistribution } from './types';

interface FunnelSummaryCardProps {
  data: FunnelDistribution[];
  totalOpportunities: number;
}

export function FunnelSummaryCard({ data, totalOpportunities }: FunnelSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900">
          Resumo por Funil
        </CardTitle>
        <CardDescription>
          Detalhamento de cada canal de vendas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((funnel, index) => {
          const percentage = (funnel.value / totalOpportunities) * 100;
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: funnel.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {funnel.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {formatNumber(funnel.value)}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {percentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: funnel.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

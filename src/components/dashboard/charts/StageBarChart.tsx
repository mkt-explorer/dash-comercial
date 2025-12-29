import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { FUNNEL_CONFIG, PIE_COLORS } from '../constants';
import { formatNumber } from '../utils/formatters';
import type { StageData, FunnelFilter } from '../types';

interface StageBarChartProps {
  data: StageData[];
  selectedFunnel: FunnelFilter;
  totalOpportunities: number;
}

export function StageBarChart({ data, selectedFunnel, totalOpportunities }: StageBarChartProps) {
  const colors = PIE_COLORS;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Funil de Vendas
            </CardTitle>
            <CardDescription className="mt-2">
              Distribuição de oportunidades por estágio
              {selectedFunnel !== 'all' && ` - ${FUNNEL_CONFIG[selectedFunnel].label}`}
            </CardDescription>
          </div>
          <Badge className={`bg-linear-to-r ${FUNNEL_CONFIG[selectedFunnel].gradient} text-white`}>
            {formatNumber(totalOpportunities)} oportunidades
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="space-y-4">
          {data.map((row, idx) => {
            const count = row.count ?? 0;
            const percent = totalOpportunities > 0 ? (count / totalOpportunities) * 100 : 0;
            const color = colors[idx % colors.length] || FUNNEL_CONFIG[selectedFunnel].color;

            return (
              <div key={row.stage} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium text-slate-700 pt-1">{row.stage}</div>

                <div className="flex-1 flex items-center gap-4">
                  <div
                    className="flex items-center justify-center text-white text-sm font-semibold rounded-md min-h-10 min-w-10"
                    style={{
                      background: color,
                    }}
                  >
                    {formatNumber(count)}
                  </div>

                  <div className="flex-1">
                    <div className="h-10 bg-slate-100 rounded-md relative overflow-hidden">
                      {count > 0 && (
                        <div
                          className="absolute left-0 top-0 bottom-0 rounded-md"
                          style={{ width: `${percent}%`, background: color }}
                        />
                      )}

                      {count === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                          Nenhuma oportunidade
                        </div>
                      )}

                      <div className="h-10" />
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-slate-600 pt-1">
                  <div className="text-xs text-slate-400">{percent.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

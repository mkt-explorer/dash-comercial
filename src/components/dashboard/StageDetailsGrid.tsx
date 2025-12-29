import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PIE_COLORS } from './constants';
import { formatNumber, formatCurrency } from './utils/formatters';
import type { StageData } from './types';

interface StageDetailsGridProps {
  data: StageData[];
}

export function StageDetailsGrid({ data }: StageDetailsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.slice(0, 6).map((stage, index) => (
        <Card key={stage.stage}>
          <CardHeader>
            <div className='flex flex-row justify-between items-center'>
                <p className="text-sm font-medium text-slate-600">{stage.stage}</p>
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] + '20' }}
                >
                #{index + 1}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start mb-4">
              <p className="text-2xl font-bold text-slate-900">{formatNumber(stage.count)}</p>
            </div>
            {stage.value > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Valor Total</span>
                <span className="font-semibold">{formatCurrency(stage.value)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

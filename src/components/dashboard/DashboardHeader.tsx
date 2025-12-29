import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Clock, Filter, RefreshCw } from 'lucide-react';
import { FUNNEL_CONFIG } from './constants';
import type { FunnelFilter } from './types';

interface DashboardHeaderProps {
  selectedFunnel: FunnelFilter;
  onFunnelChange: (funnel: FunnelFilter) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function DashboardHeader({
  selectedFunnel,
  onFunnelChange,
  onRefresh,
  refreshing,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-2">
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
        </div>
        <Select value={selectedFunnel} onValueChange={(value) => onFunnelChange(value as FunnelFilter)}>
          <SelectTrigger className="w-full sm:w-60 bg-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Selecione o funil" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FUNNEL_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onRefresh}
          disabled={refreshing}
          variant={"outline"}
          className='font-normal'
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
import { StatCard } from './StatCard';
import { Target, Activity, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatNumber, formatCurrency, formatPercentage } from './utils/formatters';
import type { DashboardStats } from './types';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <StatCard
        title="Total de Oportunidades"
        value={formatNumber(stats.totalOpportunities)}
        icon={<Target className="w-5 h-5" />}
        gradient="from-blue-500 to-indigo-600"
        trend={stats.recentOpportunities > 0 ? `+${stats.recentOpportunities} esta semana` : 'Sem novos'}
        trendUp={stats.recentOpportunities > 0}
      />
      <StatCard
        title="Oportunidades Ativas"
        value={formatNumber(stats.activeOpportunities)}
        icon={<Activity className="w-5 h-5" />}
        gradient="from-emerald-500 to-green-600"
        trend={formatPercentage((stats.activeOpportunities / stats.totalOpportunities) * 100)}
        subtitle="do total"
      />
      <StatCard
        title="Receita em Pipeline"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="w-5 h-5" />}
        gradient="from-purple-500 to-violet-600"
        trend={formatCurrency(stats.averageTicket)}
        subtitle="ticket médio"
      />
      <StatCard
        title="Taxa de Conversão"
        value={formatPercentage(stats.conversionRate)}
        icon={<CheckCircle2 className="w-5 h-5" />}
        gradient="from-amber-500 to-orange-600"
        trend={`${stats.closedDeals} negócios fechados`}
        trendUp={stats.conversionRate > 20}
      />
    </div>
  );
}

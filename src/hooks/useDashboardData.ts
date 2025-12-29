import { useState, useEffect, useMemo } from 'react';
import type { OpportunityData, EndpointKey } from '@/types/opportunities';
import type { 
  DashboardStats, 
  TimeSeriesData, 
  StageData, 
  FunnelDistribution,
  FunnelFilter 
} from '../components/dashboard/types';

export function useDashboardData(selectedFunnel: FunnelFilter) {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/opportunities?all=true&fetch_all_pages=true');
      const data = await response.json();
      
      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar oportunidades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOpportunities = useMemo(() => {
    if (selectedFunnel === 'all') return opportunities;
    return opportunities.filter(opp => opp.funnel === selectedFunnel);
  }, [opportunities, selectedFunnel]);

  const stats: DashboardStats = useMemo(() => {
    const total = filteredOpportunities.length;
    const active = filteredOpportunities.filter(
      opp => opp.stage.toLowerCase() !== 'recusa' && opp.stage.toLowerCase() !== 'perdida'
    ).length;
    
    const closed = filteredOpportunities.filter(
      opp => opp.stage.toLowerCase() === 'fechada' || opp.stage.toLowerCase() === 'ganho'
    ).length;
    
    const revenue = filteredOpportunities
      .filter(opp => opp.stage.toLowerCase() !== 'recusa')
      .reduce((sum, opp) => {
        if (opp.amount?.amountMicros) {
          return sum + parseInt(opp.amount.amountMicros) / 1000000;
        }
        return sum;
      }, 0);

    const avgTicket = active > 0 ? revenue / active : 0;
    const conversionRate = total > 0 ? (closed / total) * 100 : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = filteredOpportunities.filter(
      opp => new Date(opp.createdAt) >= sevenDaysAgo
    ).length;

    return {
      totalOpportunities: total,
      activeOpportunities: active,
      totalRevenue: revenue,
      averageTicket: avgTicket,
      closedDeals: closed,
      conversionRate,
      recentOpportunities: recent,
    };
  }, [filteredOpportunities]);

  const timeSeriesData: TimeSeriesData[] = useMemo(() => {
    const DAYS = 30;
    const dataByDate: Record<string, TimeSeriesData> = {};

    // initialize last 30 days with zeros to ensure all series align
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dataByDate[key] = {
        date: key,
        opportunities: 0,
        explorerBc: 0,
        dot: 0,
        orgaoPublico: 0,
        total: 0,
      };
    }

    // aggregate opportunities into the initialized dates
    opportunities.forEach(opp => {
      const dateKey = new Date(opp.createdAt).toISOString().split('T')[0];
      const entry = dataByDate[dateKey];
      if (!entry) return; // ignore records outside the last 30 days

      entry.total++;
      if (opp.funnel === 'opportunities') entry.opportunities++;
      else if (opp.funnel === 'explorerBc') entry.explorerBc++;
      else if (opp.funnel === 'dot') entry.dot++;
      else if (opp.funnel === 'orgaoPublico') entry.orgaoPublico++;
    });

    return Object.values(dataByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [opportunities]);

  const stageData: StageData[] = useMemo(() => {
    const stageCount: Record<string, { count: number; value: number }> = {};

    filteredOpportunities.forEach(opp => {
      const stage = opp.stage || 'Sem Estágio';
      if (!stageCount[stage]) {
        stageCount[stage] = { count: 0, value: 0 };
      }
      stageCount[stage].count++;
      
      if (opp.amount?.amountMicros) {
        stageCount[stage].value += parseInt(opp.amount.amountMicros) / 1000000;
      }
    });

    return Object.entries(stageCount)
      .map(([stage, data]) => ({ stage, count: data.count, value: data.value }))
      .sort((a, b) => b.count - a.count);
  }, [filteredOpportunities]);

  const funnelDistribution: FunnelDistribution[] = useMemo(() => {
    const distribution: Record<string, number> = {
      opportunities: 0,
      explorerBc: 0,
      dot: 0,
      orgaoPublico: 0,
    };

    opportunities.forEach(opp => {
      if (opp.funnel in distribution) {
        distribution[opp.funnel]++;
      }
    });

    const FUNNEL_CONFIG = {
      opportunities: { label: 'Opportunities', color: '#3b82f6' },
      explorerBc: { label: 'Explorer BC', color: '#10b981' },
      dot: { label: 'DOT', color: '#f59e0b' },
      orgaoPublico: { label: 'Órgão Público', color: '#ef4444' },
    };

    return Object.entries(distribution)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: FUNNEL_CONFIG[key as EndpointKey].label,
        value,
        color: FUNNEL_CONFIG[key as EndpointKey].color,
      }));
  }, [opportunities]);

  return {
    loading,
    refreshing,
    stats,
    timeSeriesData,
    stageData,
    funnelDistribution,
    opportunities,
    fetchData,
  };
}

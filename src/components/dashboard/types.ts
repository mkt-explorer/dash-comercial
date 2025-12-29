export interface DashboardStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalRevenue: number;
  averageTicket: number;
  closedDeals: number;
  conversionRate: number;
  recentOpportunities: number;
}

export interface TimeSeriesData {
  date: string;
  opportunities: number;
  explorerBc: number;
  dot: number;
  orgaoPublico: number;
  total: number;
}

export interface StageData {
  stage: string;
  count: number;
  value: number;
}

export interface FunnelDistribution {
  name: string;
  value: number;
  color: string;
}

export type FunnelFilter = 'all' | 'opportunities' | 'explorerBc' | 'dot' | 'orgaoPublico';
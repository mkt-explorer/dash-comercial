export const FUNNEL_CONFIG = {
  all: { label: 'Todos os Funis', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
  opportunities: { label: 'Oportunidades', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
  explorerBc: { label: 'Explorer BC', color: '#10b981', gradient: 'from-emerald-500 to-green-600' },
  dot: { label: 'DOT', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  orgaoPublico: { label: 'Órgão Público', color: '#ef4444', gradient: 'from-red-500 to-rose-600' },
} as const;

export const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export const chartConfig = {
  opportunities: {
    label: "Oportunidades",
    color: "hsl(217, 91%, 60%)",
  },
  explorerBc: {
    label: "Explorer BC",
    color: "hsl(142, 71%, 45%)",
  },
  dot: {
    label: "DOT",
    color: "hsl(38, 92%, 50%)",
  },
  orgaoPublico: {
    label: "Órgão Público",
    color: "hsl(0, 84%, 60%)",
  },
} as const;

"use client";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Target, PieChart as PieChartIcon } from 'lucide-react';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { TimeSeriesChart } from './charts/TimeSeriesChart';
import { StageBarChart } from './charts/StageBarChart';
import { StageDetailsGrid } from './StageDetailsGrid';
import { FunnelPieChart } from './charts/FunnelPieChart';
import { FunnelSummaryCard } from './FunnelSummaryCard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { useDashboardData } from '../../hooks/useDashboardData';
import type { FunnelFilter } from './types';

export default function OpportunitiesDashboard() {
  const [selectedFunnel, setSelectedFunnel] = useState<FunnelFilter>('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  const {
    loading,
    refreshing,
    stats,
    timeSeriesData,
    stageData,
    funnelDistribution,
    opportunities,
    fetchData,
  } = useDashboardData(selectedFunnel);

  const handleExport = () => {
    // Implementar lógica de exportação
    console.log('Exportando dados...');
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          selectedFunnel={selectedFunnel}
          onFunnelChange={setSelectedFunnel}
          onRefresh={fetchData}
          refreshing={refreshing}
        />

        <StatsGrid stats={stats} />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="stages" className="gap-2">
              <Target className="w-4 h-4" />
              Estágios
            </TabsTrigger>
            <TabsTrigger value="distribution" className="gap-2">
              <PieChartIcon className="w-4 h-4" />
              Distribuição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <TimeSeriesChart data={timeSeriesData} />
          </TabsContent>

          <TabsContent value="stages" className="space-y-6 mt-6">
            <StageBarChart 
              data={stageData} 
              selectedFunnel={selectedFunnel}
              totalOpportunities={stats.totalOpportunities}
            />
            <StageDetailsGrid data={stageData} />
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelPieChart data={funnelDistribution} />
              <FunnelSummaryCard 
                data={funnelDistribution} 
                totalOpportunities={opportunities.length}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

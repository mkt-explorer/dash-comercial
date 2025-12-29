import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: string;
  subtitle?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon, gradient, trend, subtitle, trendUp }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className='grid grid-cols-4'>
          <div className='col-span-3 flex items-center'>
            <p className="text-sm font-medium text-slate-600">{title}</p>
          </div>
          <div className='col-span-1 flex items-center justify-center'>
            <div className={`p-3 rounded-xl bg-linear-to-br ${gradient} text-white shadow-lg`}>
              {icon}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className='mb-4'>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          </div>         
          {(trend || subtitle) && (
            <div className="flex items-center gap-2 text-xs">
              {trendUp !== undefined && (
                trendUp ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-slate-500" />
                )
              )}
              <span className={`font-medium ${trendUp ? 'text-green-700' : 'text-slate-600'}`}>
                {trend}
              </span>
              {subtitle && (
                <span className="text-slate-500">• {subtitle}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
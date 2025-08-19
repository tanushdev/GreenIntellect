
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import { Company } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface IndustryBenchmarkProps {
  company: Company;
  companies: Company[];
}

const IndustryBenchmark: React.FC<IndustryBenchmarkProps> = ({ company, companies }) => {
  const isMobile = useIsMobile();

  // Calculate industry averages
  const industryCompanies = companies.filter(c => c.industry === company.industry);
  const industryAverage = {
    overall: Math.round(industryCompanies.reduce((sum, c) => sum + c.overallScore, 0) / industryCompanies.length),
    focus: Math.round(industryCompanies.reduce((sum, c) => sum + c.focusScore, 0) / industryCompanies.length),
    environment: Math.round(industryCompanies.reduce((sum, c) => sum + c.environmentScore, 0) / industryCompanies.length),
    claims: Math.round(industryCompanies.reduce((sum, c) => sum + c.claimsScore, 0) / industryCompanies.length),
    actions: Math.round(industryCompanies.reduce((sum, c) => sum + c.actionsScore, 0) / industryCompanies.length)
  };

  const benchmarkData = [
    {
      metric: 'Overall',
      company: company.overallScore,
      industry: industryAverage.overall,
      difference: company.overallScore - industryAverage.overall
    },
    {
      metric: 'Focus',
      company: company.focusScore,
      industry: industryAverage.focus,
      difference: company.focusScore - industryAverage.focus
    },
    {
      metric: isMobile ? 'Env.' : 'Environment',
      company: company.environmentScore,
      industry: industryAverage.environment,
      difference: company.environmentScore - industryAverage.environment
    },
    {
      metric: 'Claims',
      company: company.claimsScore,
      industry: industryAverage.claims,
      difference: company.claimsScore - industryAverage.claims
    },
    {
      metric: 'Actions',
      company: company.actionsScore,
      industry: industryAverage.actions,
      difference: company.actionsScore - industryAverage.actions
    }
  ];

  const getPerformanceIndicator = (difference: number) => {
    if (difference > 10) return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-600', label: 'Above Average' };
    if (difference < -10) return { icon: <TrendingDown className="w-4 h-4" />, color: 'text-red-600', label: 'Below Average' };
    return { icon: <Target className="w-4 h-4" />, color: 'text-yellow-600', label: 'Average' };
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
          <span className="text-base sm:text-xl">Industry Benchmark - {company.industry}</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600">
          Comparing against {industryCompanies.length} companies in the same industry
        </p>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {benchmarkData.slice(0, 3).map((item) => {
              const indicator = getPerformanceIndicator(item.difference);
              return (
                <div key={item.metric} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className={indicator.color}>{indicator.icon}</span>
                    <span className="font-medium text-sm sm:text-base">{item.metric}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold mb-1">{item.company}</div>
                  <div className="text-xs sm:text-sm text-gray-600">vs {item.industry} avg</div>
                  <Badge variant={item.difference > 0 ? 'default' : 'secondary'} className="mt-2 text-xs">
                    {item.difference > 0 ? '+' : ''}{item.difference} pts
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Benchmark Chart */}
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={benchmarkData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="metric" 
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-90}
                  textAnchor="end"
                  height={70}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}/100`,
                    name === 'company' ? company.name : 'Industry Average'
                  ]}
                />
                <Bar dataKey="company" fill="#3B82F6" name="company" />
                <Bar dataKey="industry" fill="#94A3B8" name="industry" />
                <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="5 5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Performance Analysis */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm sm:text-base">Performance Analysis</h4>
            <div className="space-y-2 sm:space-y-3">
              {benchmarkData.map((item) => {
                const indicator = getPerformanceIndicator(item.difference);
                return (
                  <div key={item.metric} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <span className={indicator.color}>{indicator.icon}</span>
                      <div className="min-w-0">
                        <span className="font-medium text-sm sm:text-base">{item.metric} Score</span>
                        <p className="text-xs sm:text-sm text-gray-600">{indicator.label}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm sm:text-base">{item.company}/100</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {item.difference > 0 ? '+' : ''}{item.difference} vs industry
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustryBenchmark;

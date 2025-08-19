import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/data/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ScoreChartProps {
  company: Company;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ company }) => {
  const scoreData = [
    { name: 'Focus', value: company.focusScore, color: '#3B82F6' },
    { name: 'Environment', value: company.environmentScore, color: '#10B981' },
    { name: 'Claims', value: company.claimsScore, color: '#F59E0B' },
    { name: 'Actions', value: company.actionsScore, color: '#EF4444' }
  ];

  const barData = [
    { category: 'Focus', score: company.focusScore, benchmark: 75 },
    { category: 'Environment', score: company.environmentScore, benchmark: 70 },
    { category: 'Claims', score: company.claimsScore, benchmark: 80 },
    { category: 'Actions', score: company.actionsScore, benchmark: 65 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].payload.category}</p>
          <p className="text-blue-600">Score: {payload[0].value}</p>
          <p className="text-gray-600">Industry Avg: {payload[1]?.value || 'N/A'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart vs Industry Benchmark */}
          <div>
            <h4 className="font-medium mb-3">vs Industry Benchmark</h4>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#3B82F6" name="Company Score" />
                  <Bar dataKey="benchmark" fill="#E5E7EB" name="Industry Average" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreChart;

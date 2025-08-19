
import React from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CompanyComparisonProps {
  companies: Company[];
  onRemoveCompany: (companyId: string) => void;
}

const CompanyComparison: React.FC<CompanyComparisonProps> = ({ companies, onRemoveCompany }) => {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getActionIcon = (direction: string) => {
    switch (direction) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const chartData = companies.map(company => ({
    name: company.name.split(' ')[0], // Shortened name for chart
    focus: company.focusScore,
    environment: company.environmentScore,
    claims: company.claimsScore,
    actions: company.actionsScore,
    overall: company.overallScore
  }));

  const radarData = [
    { subject: 'Focus', ...companies.reduce((acc, company, index) => ({ ...acc, [`company${index}`]: company.focusScore }), {}) },
    { subject: 'Environment', ...companies.reduce((acc, company, index) => ({ ...acc, [`company${index}`]: company.environmentScore }), {}) },
    { subject: 'Claims', ...companies.reduce((acc, company, index) => ({ ...acc, [`company${index}`]: company.claimsScore }), {}) },
    { subject: 'Actions', ...companies.reduce((acc, company, index) => ({ ...acc, [`company${index}`]: company.actionsScore }), {}) }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (companies.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Companies Selected</h3>
          <p className="text-gray-600">
            Select companies from the search results to compare their greenwashing profiles side by side.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => onRemoveCompany(company.id)}
            >
              <X className="w-4 h-4" />
            </Button>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg pr-8">{company.name}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{company.industry}</span>
                <span>•</span>
                <span>{company.reportYear}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Score</span>
                  <Badge className={getScoreBadgeColor(company.overallScore)}>
                    {company.overallScore}/100
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Focus:</span>
                    <span className="font-medium">{company.focusScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-medium">{company.environmentScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Claims:</span>
                    <span className="font-medium">{company.claimsScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actions:</span>
                    <span className="font-medium">{company.actionsScore}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t">
                  {getActionIcon(company.netActionDirection)}
                  <span className="text-sm capitalize">{company.netActionDirection} trend</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="focus" fill="#3B82F6" name="Focus Score" />
                <Bar dataKey="environment" fill="#10B981" name="Environment Score" />
                <Bar dataKey="claims" fill="#F59E0B" name="Claims Score" />
                <Bar dataKey="actions" fill="#EF4444" name="Actions Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart */}
      {companies.length <= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  {companies.map((company, index) => (
                    <Radar
                      key={company.id}
                      name={company.name}
                      dataKey={`company${index}`}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Company</th>
                  <th className="text-center py-3">Overall</th>
                  <th className="text-center py-3">Focus</th>
                  <th className="text-center py-3">Environment</th>
                  <th className="text-center py-3">Claims</th>
                  <th className="text-center py-3">Actions</th>
                  <th className="text-center py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-gray-500 text-xs">{company.industry}</div>
                      </div>
                    </td>
                    <td className="text-center py-3">
                      <Badge className={getScoreBadgeColor(company.overallScore)}>
                        {company.overallScore}
                      </Badge>
                    </td>
                    <td className="text-center py-3 font-medium">{company.focusScore}</td>
                    <td className="text-center py-3 font-medium">{company.environmentScore}</td>
                    <td className="text-center py-3 font-medium">{company.claimsScore}</td>
                    <td className="text-center py-3 font-medium">{company.actionsScore}</td>
                    <td className="text-center py-3">
                      <div className="flex items-center justify-center">
                        {getActionIcon(company.netActionDirection)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyComparison;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Company } from '@/data/mockData';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ClaimsBreakdownProps {
  company: Company;
}

const ClaimsBreakdown: React.FC<ClaimsBreakdownProps> = ({ company }) => {
  const claimsData = [
    {
      category: 'Carbon Neutrality',
      status: 'verified',
      score: 85,
      description: 'Claims supported by third-party verification',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      category: 'Renewable Energy',
      status: 'partial',
      score: 65,
      description: 'Some supporting data, requires more transparency',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      category: 'Waste Reduction',
      status: 'unverified',
      score: 35,
      description: 'Claims lack sufficient supporting evidence',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      category: 'Water Conservation',
      status: 'verified',
      score: 78,
      description: 'Well-documented initiatives with measurable results',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Partial</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Unverified</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Claims Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claimsData.map((claim, index) => {
            const IconComponent = claim.icon;
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-5 h-5 ${claim.color}`} />
                    <h4 className="font-medium">{claim.category}</h4>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{claim.description}</p>
                <div className="flex items-center space-x-3">
                  <Progress value={claim.score} className="flex-1 h-2" />
                  <span className="text-sm font-medium min-w-[3rem]">{claim.score}/100</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Analysis Summary</h4>
          <p className="text-sm text-blue-800">
            {company.name} shows mixed results in environmental claims verification. 
            Strong performance in carbon neutrality and water conservation, but waste reduction 
            claims need better documentation and transparency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClaimsBreakdown;

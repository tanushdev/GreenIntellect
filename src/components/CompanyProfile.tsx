import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingDown, TrendingUp, AlertTriangle, Lock, Target, Leaf, MessageSquare, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Company } from '@/data/mockData';
import AuthDialog from '@/components/AuthDialog';
import ExportCapabilities from '@/components/analytics/ExportCapabilities';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompanyProfileProps {
  company: Company;
  onAddToComparison?: (company: Company) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ company, onAddToComparison }) => {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const isMobile = useIsMobile();

  // If user is not authenticated, show auth prompt
  if (!user) {
    return (
      <>
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to view company greenwashing profiles and analysis reports.
            </p>
            <Button onClick={() => setShowAuthDialog(true)} className="bg-green-600 hover:bg-green-700">
              Sign In to View Reports
            </Button>
          </CardContent>
        </Card>
        
        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    return 'High';
  };

  // Mock claims data based on company scores
  const claims = [
    { type: "Carbon Neutral", score: company.environmentScore, status: company.environmentScore >= 70 ? "verified" : company.environmentScore >= 40 ? "questionable" : "misleading" },
    { type: "Renewable Energy", score: company.actionsScore, status: company.actionsScore >= 70 ? "verified" : company.actionsScore >= 40 ? "questionable" : "misleading" },
    { type: "Sustainable Materials", score: company.claimsScore, status: company.claimsScore >= 70 ? "verified" : company.claimsScore >= 40 ? "questionable" : "misleading" }
  ];

  const redFlags = [
    "Vague sustainability commitments without specific targets",
    "Limited third-party verification for environmental claims",
    "Inconsistent reporting methodology year-over-year"
  ];

  const positives = [
    "Detailed environmental transition plan",
    "Third-party audited supply chain data",
    "Clear timeline for emissions reduction goals"
  ];

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'questionable': return 'bg-yellow-100 text-yellow-800';
      case 'misleading': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const scoreExplanations = {
    focus: "Measures how clearly the company defines its environmental focus areas and commitment to sustainability goals.",
    environment: "Evaluates the company's actual environmental impact and improvement initiatives based on concrete data.",
    claims: "Assesses the accuracy and verifiability of environmental claims made in company communications.",
    actions: "Analyzes real actions taken by the company to achieve stated environmental goals and commitments."
  };

  const radarData = [
    { category: 'Focus', score: company.focusScore },
    { category: 'Environment', score: company.environmentScore },
    { category: 'Claims', score: company.claimsScore },
    { category: 'Actions', score: company.actionsScore }
  ];

  const isHighGreenwashingRisk = company.netActionDirection === 'negative';

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <p className="text-gray-600">{company.industry}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getRiskColor(company.overallScore)}>
                {getRiskLevel(company.overallScore)} Risk
              </Badge>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(company.overallScore)}`}>
                  {company.overallScore}
                </div>
                <p className="text-sm text-gray-500">Greenwashing Score</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Report Year:</span> {company.reportYear}
            </div>
            <div>
              <span className="font-medium">Last Analyzed:</span> {new Date().toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Claims Analyzed:</span> {claims.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Greenwashing Risk Alert */}
      {isHighGreenwashingRisk && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>High Greenwashing Risk Detected</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              This company shows a <strong>negative net action direction</strong>, indicating potential greenwashing practices. 
              Their environmental claims may not be backed by sufficient concrete actions.
            </p>
            <div className="bg-red-100 p-3 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Key Warning Signs:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Gap between environmental claims and actual implementation</li>
                <li>• Limited evidence of meaningful sustainability actions</li>
                <li>• Potential for misleading stakeholders about environmental impact</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Breakdown with Explanations */}
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Radar Chart */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={isMobile ? '60%' : '80%'}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: isMobile ? 10 : 12, fill: '#6B7280' }} />
                  <Radar name={company.name} dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background p-2 border rounded-lg shadow-sm">
                            <p className="text-sm font-medium">{`${payload[0].payload.category}: ${payload[0].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: 'transparent' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              {/* Focus Score */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-sm">Focus Score</h4>
                  <div className={`text-lg font-bold ${getScoreColor(company.focusScore)}`}>
                    {company.focusScore}/100
                  </div>
                </div>
                <Progress value={company.focusScore} className="w-full mb-2 h-2" />
                <p className="text-xs text-gray-600">{scoreExplanations.focus}</p>
              </div>

              {/* Environment Score */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-sm">Environment Score</h4>
                  <div className={`text-lg font-bold ${getScoreColor(company.environmentScore)}`}>
                    {company.environmentScore}/100
                  </div>
                </div>
                <Progress value={company.environmentScore} className="w-full mb-2 h-2" />
                <p className="text-xs text-gray-600">{scoreExplanations.environment}</p>
              </div>

              {/* Claims Score */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium text-sm">Claims Score</h4>
                  <div className={`text-lg font-bold ${getScoreColor(company.claimsScore)}`}>
                    {company.claimsScore}/100
                  </div>
                </div>
                <Progress value={company.claimsScore} className="w-full mb-2 h-2" />
                <p className="text-xs text-gray-600">{scoreExplanations.claims}</p>
              </div>

              {/* Actions Score */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <h4 className="font-medium text-sm">Actions Score</h4>
                  <div className={`text-lg font-bold ${getScoreColor(company.actionsScore)}`}>
                    {company.actionsScore}/100
                  </div>
                </div>
                <Progress value={company.actionsScore} className="w-full mb-2 h-2" />
                <p className="text-xs text-gray-600">{scoreExplanations.actions}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Claims Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Claims Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{claim.type}</h4>
                    <Badge className={getClaimStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                  </div>
                  <Progress value={claim.score} className="w-full" />
                </div>
                <div className="ml-4">
                  <div className={`text-2xl font-bold ${getScoreColor(claim.score)}`}>
                    {claim.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Red Flags and Positives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Red Flags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Positive Indicators</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {positives.map((positive, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{positive}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <ExportCapabilities selectedCompany={company} />
            {onAddToComparison && (
              <Button 
                onClick={() => onAddToComparison(company)}
                className="flex items-center space-x-2"
              >
                <span>Add to Comparison</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default CompanyProfile;

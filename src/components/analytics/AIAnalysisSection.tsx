
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Clock } from 'lucide-react';
import { Company } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIAnalysisSectionProps {
  company: Company;
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ company }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  // Rate limiting: minimum 5 seconds between requests
  const MIN_REQUEST_INTERVAL = 5000;

  const generateAnalysis = async (isManual = false) => {
    // Rate limiting check
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL && !isManual) {
      console.log('Rate limiting: skipping request');
      return;
    }

    setLoading(true);
    setError('');
    setLastRequestTime(now);
    
    try {
      const prompt = `Please provide a comprehensive greenwashing analysis for ${company.name}, a company in the ${company.industry} industry. Here are their sustainability scores:

**Company Details:**
- Company: ${company.name}
- Industry: ${company.industry}
- Report Year: ${company.reportYear}
- Overall Greenwashing Score: ${company.overallScore}/100
- Net Action Direction: ${company.netActionDirection}

**Individual Scores:**
- Focus Score: ${company.focusScore}/100 (measures clarity of environmental focus and commitment)
- Environment Score: ${company.environmentScore}/100 (evaluates actual environmental impact and initiatives)
- Claims Score: ${company.claimsScore}/100 (assesses accuracy and verifiability of environmental claims)
- Actions Score: ${company.actionsScore}/100 (analyzes real actions taken to achieve environmental goals)

**Analysis Required:**

1. **Overall Assessment**
   - Explain why ${company.name} has an overall score of ${company.overallScore}/100
   - Classify this as ${company.overallScore >= 70 ? 'LOW' : company.overallScore >= 40 ? 'MODERATE' : 'HIGH'} greenwashing risk and explain why

2. **Individual Score Analysis**
   - Break down what each score means for ${company.name}
   - Identify the strongest and weakest areas
   - Explain how these scores relate to typical ${company.industry} industry practices

3. **Greenwashing Risk Assessment**
   - Based on the ${company.netActionDirection} net action direction, assess the likelihood of greenwashing
   - Provide specific red flags or positive indicators
   - Compare against industry benchmarks

4. **Investment Recommendations**
   - Provide clear guidance for investors and stakeholders
   - Highlight key areas to monitor
   - Suggest questions to ask ${company.name} about their sustainability practices

5. **Industry Context**
   - How does ${company.name} compare to other ${company.industry} companies?
   - What are the unique sustainability challenges in ${company.industry}?

Please provide specific, actionable insights and avoid generic statements. Use the company name throughout the analysis to make it personalized.`;

      const { data, error } = await supabase.functions.invoke('generate-ai-analysis', {
        body: { prompt }
      });

      if (!mountedRef.current) return; // Component unmounted

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
      setError('');
      
      toast({
        title: "Analysis Generated",
        description: `AI analysis for ${company.name} has been generated successfully.`,
      });
    } catch (error) {
      if (!mountedRef.current) return; // Component unmounted
      
      console.error('Error generating analysis:', error);
      
      let errorMessage = "Failed to generate AI analysis. Please try again.";
      
      if (error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
        errorMessage = "AI service is temporarily busy. Please wait a moment before trying again.";
        setError('rate_limit');
      } else if (error.message?.includes('ANTHROPIC_API_KEY')) {
        errorMessage = "Claude API key is not configured. Please contact support.";
        setError('config');
      } else {
        setError('general');
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    // Delay initial analysis to avoid immediate rate limits
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        generateAnalysis();
      }
    }, 2000);
    
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [company.id]);

  const getRiskBadgeColor = () => {
    if (company.netActionDirection === 'positive' && company.overallScore >= 70) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (company.netActionDirection === 'negative' || company.overallScore < 40) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getRiskLevel = () => {
    if (company.netActionDirection === 'positive' && company.overallScore >= 70) {
      return 'Low Greenwashing Risk';
    } else if (company.netActionDirection === 'negative' || company.overallScore < 40) {
      return 'High Greenwashing Risk';
    }
    return 'Moderate Greenwashing Risk';
  };

  const getRiskIcon = () => {
    if (company.netActionDirection === 'positive' && company.overallScore >= 70) {
      return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    } else if (company.netActionDirection === 'negative' || company.overallScore < 40) {
      return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
    }
    return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
  };

  const formatAnalysis = (text: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a header (starts with ** and ends with **)
      if (paragraph.startsWith('**') && paragraph.includes('**')) {
        const headerMatch = paragraph.match(/^\*\*(.*?)\*\*/);
        if (headerMatch) {
          const header = headerMatch[1];
          const content = paragraph.replace(/^\*\*(.*?)\*\*/, '').trim();
          return (
            <div key={index} className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{header}</h3>
              {content && <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{content}</p>}
            </div>
          );
        }
      }
      
      // Regular paragraph
      if (paragraph.trim()) {
        return (
          <p key={index} className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
            {paragraph.trim()}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  const renderErrorState = () => {
    if (error === 'rate_limit') {
      return (
        <div className="text-center py-8 sm:py-12">
          <Clock className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">AI Service Busy</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
            The AI service is currently busy. Please wait a moment before trying again.
          </p>
          <Button 
            onClick={() => generateAnalysis(true)} 
            variant="outline" 
            disabled={loading || (Date.now() - lastRequestTime < MIN_REQUEST_INTERVAL)}
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    if (error === 'config') {
      return (
        <div className="text-center py-8 sm:py-12">
          <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Configuration Error</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Claude API key is not configured. Please contact support.</p>
        </div>
      );
    }

    return (
      <div className="text-center py-8 sm:py-12">
        <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-red-500" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Unable to generate analysis. Please try again.</p>
        <Button 
          onClick={() => generateAnalysis(true)} 
          variant="outline"
          disabled={loading || (Date.now() - lastRequestTime < MIN_REQUEST_INTERVAL)}
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Analysis
        </Button>
      </div>
    );
  };

  const canRegenerate = !loading && (Date.now() - lastRequestTime >= MIN_REQUEST_INTERVAL);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
            <span className="text-base sm:text-xl">AI-Powered Greenwashing Analysis</span>
          </CardTitle>
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
            <Badge className={`${getRiskBadgeColor()} justify-center sm:justify-start`}>
              {getRiskIcon()}
              <span className="ml-1 text-xs sm:text-sm">{getRiskLevel()}</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateAnalysis(true)}
              disabled={!canRegenerate}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-sm sm:text-base text-gray-600 mb-2 px-4">Generating detailed analysis for {company.name}...</p>
              <p className="text-xs sm:text-sm text-gray-500">Powered by Claude AI</p>
            </div>
          </div>
        ) : error ? (
          renderErrorState()
        ) : analysis ? (
          <div className="prose max-w-none">
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Analysis for {company.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{company.industry} • Report Year: {company.reportYear}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">{company.overallScore}</div>
                  <div className="text-xs text-gray-600">Overall Score</div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{company.focusScore}</div>
                  <div className="text-xs text-gray-600">Focus</div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{company.environmentScore}</div>
                  <div className="text-xs text-gray-600">Environment</div>
                </div>
                <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{company.actionsScore}</div>
                  <div className="text-xs text-gray-600">Actions</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {formatAnalysis(analysis)}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-4 text-gray-400" />
            <p className="text-sm sm:text-base px-4">Click "Regenerate" to generate AI analysis for {company.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisSection;

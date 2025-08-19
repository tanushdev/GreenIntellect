import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  reportYear: string;
  reportType: string;
  pagesAnalyzed: number;
  lastUpdated: string;
  overallScore: number;
  focusScore: number;
  environmentScore: number;
  claimsScore: number;
  actionsScore: number;
  netActionDirection: 'positive' | 'negative' | 'neutral';
  keyFindings: {
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
  }[];
}

// Legacy mock data for backwards compatibility - will be replaced by database data
export const mockCompanies: Company[] = [];

// Function to fetch companies from database
export const fetchCompaniesFromDatabase = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('analyzed_companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(company => ({
      id: company.id,
      name: company.name,
      industry: company.industry || 'Various Industries',
      headquarters: company.headquarters || 'Location TBD',
      reportYear: company.report_year || new Date().getFullYear().toString(),
      reportType: company.report_type || 'Database Import',
      pagesAnalyzed: company.pages_analyzed || 0,
      lastUpdated: company.last_updated || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      overallScore: company.overall_score || 0,
      focusScore: company.focus_score || 0,
      environmentScore: company.environment_score || 0,
      claimsScore: company.claims_score || 0,
      actionsScore: company.actions_score || 0,
      netActionDirection: company.net_action_direction as 'positive' | 'negative' | 'neutral' || 'neutral',
      keyFindings: Array.isArray(company.key_findings) 
        ? company.key_findings as Company['keyFindings']
        : []
    })) || [];
  } catch (error) {
    console.error('Error fetching companies from database:', error);
    return [];
  }
};

export const industryData = [
  { name: 'Technology', value: 23, color: '#3B82F6' },
  { name: 'Financial Services', value: 18, color: '#10B981' },
  { name: 'Healthcare', value: 15, color: '#F59E0B' },
  { name: 'Manufacturing', value: 12, color: '#EF4444' },
  { name: 'Energy', value: 10, color: '#8B5CF6' },
  { name: 'Retail', value: 8, color: '#06B6D4' },
  { name: 'Real Estate', value: 7, color: '#84CC16' },
  { name: 'Other', value: 7, color: '#6B7280' }
];

export const scoreDistribution = [
  { range: '90-100', count: 5, color: '#10B981' },
  { range: '80-89', count: 12, color: '#84CC16' },
  { range: '70-79', count: 18, color: '#F59E0B' },
  { range: '60-69', count: 15, color: '#EF4444' },
  { range: '50-59', count: 8, color: '#DC2626' },
  { range: '0-49', count: 3, color: '#991B1B' }
];


import React from 'react';
import CompanyProfile from '@/components/CompanyProfile';
import IndustryBenchmark from './IndustryBenchmark';
import AIAnalysisSection from './AIAnalysisSection';
import { Company } from '@/data/mockData';

interface CompanyAnalysisSectionProps {
  selectedCompany: Company;
  companies: Company[];
}

const CompanyAnalysisSection: React.FC<CompanyAnalysisSectionProps> = ({
  selectedCompany,
  companies
}) => (
  <div id="company-profile-section" className="space-y-6">
    <CompanyProfile company={selectedCompany} />
    <AIAnalysisSection company={selectedCompany} />
    <IndustryBenchmark company={selectedCompany} companies={companies} />
  </div>
);

export default CompanyAnalysisSection;

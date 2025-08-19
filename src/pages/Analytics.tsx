
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AdvancedFilters from '@/components/analytics/AdvancedFilters';
import EnhancedCompanyComparison from '@/components/analytics/EnhancedCompanyComparison';
import CompanySearchResults from '@/components/analytics/CompanySearchResults';
import AuthPrompt from '@/components/analytics/AuthPrompt';
import AnalyticsNavigation from '@/components/analytics/AnalyticsNavigation';
import CompanyAnalysisSection from '@/components/analytics/CompanyAnalysisSection';
import FileUpload from '@/components/FileUpload';
import PdfUploadTracker from '@/components/PdfUploadTracker';
import AuthDialog from '@/components/AuthDialog';
import { TabsContent } from '@/components/ui/tabs';
import { Company, fetchCompaniesFromDatabase } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('search');
  const [comparisonCompanies, setComparisonCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const companiesPerPage = 6;

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompaniesFromDatabase();
        // Enhanced scoring algorithm with positive company boost
        const enhancedData = data.map(company => {
          let overallScore = company.overallScore;

          // Boost positive companies significantly
          if (company.netActionDirection === 'positive') {
            overallScore = Math.min(95, overallScore + 15);
          }

          // Apply industry-specific adjustments
          if (company.industry === 'Technology' && company.environmentScore > 60) {
            overallScore = Math.min(90, overallScore + 8);
          }

          return {
            ...company,
            overallScore: Math.max(10, overallScore) // Ensure minimum score
          };
        });
        setCompanies(enhancedData);
        if (enhancedData.length > 0 && !selectedCompany) {
          setSelectedCompany(enhancedData[0]);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [selectedCompany]);

  // Enhanced filtering logic - only by company name now
  const filteredCompanies = companies.filter(company => {
    return company.name.toLowerCase().includes(searchTerm.toLowerCase()) || company.industry.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const clearFilters = () => {
    setSearchTerm('');
  };

  const handleSearch = () => {
    // Search is reactive, but this provides feedback
    setCurrentPage(1);
  };

  const addToComparison = (company: Company) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    if (comparisonCompanies.length < 5 && !comparisonCompanies.find(c => c.id === company.id)) {
      setComparisonCompanies([...comparisonCompanies, company]);
    }
  };

  const removeFromComparison = (companyId: string) => {
    setComparisonCompanies(comparisonCompanies.filter(c => c.id !== companyId));
  };

  const viewCompanyDetails = (company: Company) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setSelectedCompany(company);
    setTimeout(() => {
      const profileElement = document.getElementById('company-profile-section');
      if (profileElement) {
        profileElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">Loading analytics data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">GreenIntellect Analytics</h1>
            <p className="text-sm sm:text-base text-gray-600">Comprehensive sustainability performance analysis and insights</p>
          </div>

          {/* Main Navigation Tabs with Content */}
          <AnalyticsNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            comparisonCount={comparisonCompanies.length}
          >
            {/* Search & Analyze Tab */}
            <TabsContent value="search" className="space-y-4 sm:space-y-6">
              {/* Simplified Search */}
              <AdvancedFilters 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                onClearFilters={clearFilters} 
                onSearch={handleSearch} 
              />

              {/* Search Results */}
              <CompanySearchResults
                companies={filteredCompanies}
                selectedCompany={selectedCompany}
                user={user}
                comparisonCompanies={comparisonCompanies}
                currentPage={currentPage}
                totalPages={totalPages}
                companiesPerPage={companiesPerPage}
                onSelectCompany={setSelectedCompany}
                onViewCompanyDetails={viewCompanyDetails}
                onAddToComparison={addToComparison}
                onPageChange={setCurrentPage}
                onShowAuthDialog={() => setShowAuthDialog(true)}
              />

              {/* Selected Company Analysis - Only for authenticated users */}
              {user && selectedCompany ? (
                <CompanyAnalysisSection 
                  selectedCompany={selectedCompany}
                  companies={companies}
                />
              ) : (
                !user && (
                  <AuthPrompt
                    title="Unlock Detailed Company Analytics"
                    description="Access comprehensive greenwashing analysis, risk assessments, and industry benchmarks for every company in our database."
                    onShowAuthDialog={() => setShowAuthDialog(true)}
                  />
                )
              )}
            </TabsContent>

            {/* Upload Report Tab */}
            <TabsContent value="upload" className="space-y-4 sm:space-y-6">
              {user ? (
                <>
                  <FileUpload />
                  <PdfUploadTracker />
                </>
              ) : (
                <AuthPrompt
                  title="Upload Your Company Reports"
                  description="Analyze your sustainability reports with our advanced AI to identify greenwashing patterns and get actionable insights."
                  onShowAuthDialog={() => setShowAuthDialog(true)}
                />
              )}
            </TabsContent>

            {/* Enhanced Compare Companies Tab */}
            <TabsContent value="compare">
              {user ? (
                <EnhancedCompanyComparison 
                  companies={comparisonCompanies} 
                  onRemoveCompany={removeFromComparison} 
                />
              ) : (
                <AuthPrompt
                  title="Compare Company Sustainability Performance"
                  description="Side-by-side analysis of multiple companies to identify leaders and laggards in environmental commitments and actions."
                  onShowAuthDialog={() => setShowAuthDialog(true)}
                />
              )}
            </TabsContent>
          </AnalyticsNavigation>
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
};

export default Analytics;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Building2, TrendingUp, TrendingDown, Minus, Plus, Lock, Eye } from 'lucide-react';
import { Company } from '@/data/mockData';
import ExportCapabilities from './ExportCapabilities';

interface CompanySearchResultsProps {
  companies: Company[];
  selectedCompany: Company | null;
  user: any;
  comparisonCompanies: Company[];
  currentPage: number;
  totalPages: number;
  companiesPerPage: number;
  onSelectCompany: (company: Company) => void;
  onViewCompanyDetails: (company: Company) => void;
  onAddToComparison: (company: Company) => void;
  onPageChange: (page: number) => void;
  onShowAuthDialog: () => void;
}

const CompanySearchResults: React.FC<CompanySearchResultsProps> = ({
  companies,
  selectedCompany,
  user,
  comparisonCompanies,
  currentPage,
  totalPages,
  companiesPerPage,
  onSelectCompany,
  onViewCompanyDetails,
  onAddToComparison,
  onPageChange,
  onShowAuthDialog
}) => {
  const startIndex = (currentPage - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const currentCompanies = companies.slice(startIndex, endIndex);

  const getTrendIcon = (direction: 'positive' | 'negative' | 'neutral') => {
    switch (direction) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-lg sm:text-xl">Company Analysis Results</span>
          </CardTitle>
          {user && selectedCompany && <ExportCapabilities selectedCompany={selectedCompany} companies={companies} />}
        </div>
      </CardHeader>
      <CardContent>
        {/* Results Summary */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, companies.length)} of {companies.length} companies
          </div>
          {totalPages > 1 && (
            <div className="text-xs sm:text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Search Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {currentCompanies.length > 0 ? (
            currentCompanies.map(company => (
              <Card
                key={company.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedCompany?.id === company.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => user ? onSelectCompany(company) : onShowAuthDialog()}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{company.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{company.industry} • {company.reportYear}</p>
                    </div>
                    {user ? (
                      <Badge className={`text-xs shrink-0 ${getScoreColor(company.overallScore)}`}>
                        {company.overallScore}/100
                      </Badge>
                    ) : (
                      <div className="shrink-0 flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                        <Lock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">Login</span>
                      </div>
                    )}
                  </div>
                  
                  {user ? (
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs mb-3">
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
                  ) : (
                    <div className="bg-gray-50 p-2 sm:p-3 rounded mb-3 text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Sign in to view detailed scores</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    {user ? (
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(company.netActionDirection)}
                        <span className="text-xs sm:text-sm capitalize text-gray-600">
                          {company.netActionDirection}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-xs sm:text-sm text-gray-400">Protected</span>
                      </div>
                    )}
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          onViewCompanyDetails(company);
                        }}
                        className="text-xs flex-1 sm:flex-none h-7 sm:h-8 px-2 sm:px-3"
                      >
                        {user ? 'View' : 'Login'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.stopPropagation();
                          onAddToComparison(company);
                        }}
                        disabled={!user || comparisonCompanies.find(c => c.id === company.id) !== undefined}
                        className="text-xs flex-1 sm:flex-none h-7 sm:h-8 px-2 sm:px-3"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Compare</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 text-sm sm:text-base">
              {companies.length === 0 ? 'No companies available' : 'No companies match your search criteria'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                    className={`text-xs sm:text-sm h-8 sm:h-10 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>
                
                {Array.from({
                  length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages)
                }, (_, i) => {
                  let pageNum;
                  const maxPages = window.innerWidth < 640 ? 3 : 5;
                  if (totalPages <= maxPages) {
                    pageNum = i + 1;
                  } else if (currentPage <= Math.floor(maxPages / 2) + 1) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                    pageNum = totalPages - maxPages + 1 + i;
                  } else {
                    pageNum = currentPage - Math.floor(maxPages / 2) + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        isActive={currentPage === pageNum} 
                        onClick={e => {
                          e.preventDefault();
                          onPageChange(pageNum);
                        }} 
                        className="cursor-pointer text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > (window.innerWidth < 640 ? 3 : 5) && currentPage < totalPages - Math.floor((window.innerWidth < 640 ? 3 : 5) / 2) && (
                  <PaginationItem>
                    <PaginationEllipsis className="h-8 sm:h-10" />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      if (currentPage < totalPages) onPageChange(currentPage + 1);
                    }}
                    className={`text-xs sm:text-sm h-8 sm:h-10 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySearchResults;

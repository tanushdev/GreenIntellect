import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, Building2, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import AnalyzedCompanyUpload from './AnalyzedCompanyUpload';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type AnalyzedCompany = Database['public']['Tables']['analyzed_companies']['Row'];

const AnalyzedCompanies = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<AnalyzedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editingCompany, setEditingCompany] = useState<AnalyzedCompany | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('analyzed_companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load analyzed companies.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from('analyzed_companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      setCompanies(companies.filter(company => company.id !== companyId));
      toast({
        title: "Success",
        description: "Company deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error",
        description: "Failed to delete company.",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Industry', 'Overall Score', 'Focus Score', 'Environment Score', 'Claims Score', 'Actions Score', 'Net Action Direction', 'Report Year'],
      ...companies.map(company => [
        company.name,
        company.industry,
        company.overall_score,
        company.focus_score,
        company.environment_score,
        company.claims_score,
        company.actions_score,
        company.net_action_direction,
        company.report_year
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analyzed-companies.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);
  
  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderPaginationItems = () => {
    const items: (number | string)[] = [];
    const pageRange = 1; // How many pages to show around current page

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            items.push(i);
        }
    } else {
        items.push(1);
        if (currentPage > pageRange + 2) {
            items.push('...');
        }
        for (let i = Math.max(2, currentPage - pageRange); i <= Math.min(totalPages - 1, currentPage + pageRange); i++) {
            items.push(i);
        }
        if (currentPage < totalPages - pageRange - 1) {
            items.push('...');
        }
        items.push(totalPages);
    }
    
    const uniqueItems = [...new Set(items)];

    return uniqueItems.map((item, index) => (
        <PaginationItem key={index}>
            {typeof item === 'string' ? (
                <PaginationEllipsis />
            ) : (
                <PaginationLink
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(item);
                    }}
                    isActive={currentPage === item}
                >
                    {item}
                </PaginationLink>
            )}
        </PaginationItem>
    ));
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading analyzed companies...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 sm:mb-8">
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-base sm:text-xl">Analyzed Companies Management</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={() => setShowUpload(true)} 
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
            <Button 
              onClick={fetchCompanies} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Companies List */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm sm:text-base">
              {companies.length === 0 ? 'No analyzed companies yet.' : 'No companies match your search.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {paginatedCompanies.map((company) => (
                <div
                  key={company.id}
                  className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {company.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {company.industry} • Report Year: {company.report_year}
                          </p>
                        </div>
                        <Badge className={`${getScoreColor(company.overall_score)} mt-2 sm:mt-0 sm:ml-3 self-start text-xs`}>
                          {company.overall_score}/100
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs">
                        <div className="flex justify-between sm:flex-col sm:items-center">
                          <span className="text-gray-600 sm:mb-1">Focus:</span>
                          <span className="font-medium">{company.focus_score}</span>
                        </div>
                        <div className="flex justify-between sm:flex-col sm:items-center">
                          <span className="text-gray-600 sm:mb-1">Environment:</span>
                          <span className="font-medium">{company.environment_score}</span>
                        </div>
                        <div className="flex justify-between sm:flex-col sm:items-center">
                          <span className="text-gray-600 sm:mb-1">Claims:</span>
                          <span className="font-medium">{company.claims_score}</span>
                        </div>
                        <div className="flex justify-between sm:flex-col sm:items-center">
                          <span className="text-gray-600 sm:mb-1">Actions:</span>
                          <span className="font-medium">{company.actions_score}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCompany(company)}
                        className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCompany(company.id)}
                        className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>

      {/* Upload/Edit Dialog */}
      {(showUpload || editingCompany) && (
        <AnalyzedCompanyUpload
          company={editingCompany}
          onClose={() => {
            setShowUpload(false);
            setEditingCompany(null);
          }}
          onSuccess={() => {
            fetchCompanies();
            setShowUpload(false);
            setEditingCompany(null);
          }}
        />
      )}
    </Card>
  );
};

export default AnalyzedCompanies;

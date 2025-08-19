
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Database, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Company {
  name: string;
  uploadCount: number;
  lastUpload?: string | null;
  source?: string;
}

interface CompanyManagementProps {
  companies: Company[];
  onCompaniesUpdate: (companies: Company[]) => void;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({
  companies,
  onCompaniesUpdate,
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file first.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length < 2) {
        toast({
          title: "Error",
          description: "CSV file must have at least a header row and one data row.",
          variant: "destructive"
        });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
      
      // Look for company name column with better matching
      const companyColumnIndex = headers.findIndex(h => {
        const lowerH = h.toLowerCase();
        return lowerH.includes('company') || 
               lowerH.includes('name') ||
               lowerH.includes('organization') ||
               lowerH.includes('business') ||
               lowerH === 'org';
      });

      if (companyColumnIndex === -1) {
        toast({
          title: "Error",
          description: `Could not find company name column in CSV. Found columns: ${headers.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      const companyNames = lines.slice(1)
        .map(line => {
          const columns = line.split(',');
          return columns[companyColumnIndex]?.trim().replace(/['"]/g, '');
        })
        .filter(name => name && name.length > 0)
        .filter((name, index, arr) => arr.indexOf(name) === index); // Remove duplicates

      if (companyNames.length === 0) {
        toast({
          title: "Error",
          description: "No valid company names found in the CSV file.",
          variant: "destructive"
        });
        return;
      }

      // Create new CSV companies
      const csvCompanies = companyNames.map(name => ({
        name,
        uploadCount: 0,
        lastUpload: null,
        source: 'CSV'
      }));

      // Filter out companies that already exist (by name)
      const existingCompanyNames = companies.map(c => c.name.toLowerCase());
      const newCsvCompanies = csvCompanies.filter(
        company => !existingCompanyNames.includes(company.name.toLowerCase())
      );

      if (newCsvCompanies.length === 0) {
        toast({
          title: "Info",
          description: "All companies from the CSV already exist in the database.",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Added ${newCsvCompanies.length} new companies from CSV file.`,
      });

      // Update companies list with new CSV companies
      onCompaniesUpdate([...companies, ...newCsvCompanies]);
      setCsvFile(null);
    };

    reader.readAsText(csvFile);
  };

  const removeCompany = (companyName: string) => {
    const updatedCompanies = companies.filter(company => company.name !== companyName);
    onCompaniesUpdate(updatedCompanies);
    toast({
      title: "Success",
      description: `Removed ${companyName} from the company database.`,
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Company Database Management</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="w-auto"
            />
            <Button onClick={handleCsvUpload} disabled={!csvFile}>
              <Upload className="w-4 h-4 mr-1" />
              Import CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company, index) => (
            <div key={`${company.name}-${index}`} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex-1 truncate">{company.name}</h4>
                <div className="flex items-center space-x-2">
                  {company.source === 'CSV' && (
                    <Badge variant="outline" className="text-xs">CSV</Badge>
                  )}
                  {company.source === 'CSV' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompany(company.name)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Uploads: {company.uploadCount}</p>
                {company.lastUpload && (
                  <p>Last upload: {new Date(company.lastUpload).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">Upload a CSV file or wait for PDF uploads to populate company data.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyManagement;

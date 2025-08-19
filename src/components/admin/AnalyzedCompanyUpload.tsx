
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet, AlertCircle, Database, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database as DatabaseType } from '@/integrations/supabase/types';

type AnalyzedCompany = DatabaseType['public']['Tables']['analyzed_companies']['Row'];

interface AnalyzedCompanyUploadProps {
  company?: AnalyzedCompany | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AnalyzedCompanyUpload: React.FC<AnalyzedCompanyUploadProps> = ({
  company,
  onClose,
  onSuccess
}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualData, setManualData] = useState({
    name: company?.name || '',
    industry: company?.industry || '',
    overall_score: company?.overall_score || 0,
    focus_score: company?.focus_score || 0,
    environment_score: company?.environment_score || 0,
    claims_score: company?.claims_score || 0,
    actions_score: company?.actions_score || 0,
    net_action_direction: company?.net_action_direction || 'neutral',
    report_year: company?.report_year || new Date().getFullYear().toString()
  });

  const handleManualSubmit = async () => {
    if (!manualData.name.trim()) {
      toast({
        title: "Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (company) {
        // Update existing company
        const { error } = await supabase
          .from('analyzed_companies')
          .update({
            name: manualData.name,
            industry: manualData.industry,
            overall_score: manualData.overall_score,
            focus_score: manualData.focus_score,
            environment_score: manualData.environment_score,
            claims_score: manualData.claims_score,
            actions_score: manualData.actions_score,
            net_action_direction: manualData.net_action_direction,
            report_year: manualData.report_year,
            updated_at: new Date().toISOString()
          })
          .eq('id', company.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company updated successfully.",
        });
      } else {
        // Create new company
        const { error } = await supabase
          .from('analyzed_companies')
          .insert([{
            name: manualData.name,
            industry: manualData.industry,
            overall_score: manualData.overall_score,
            focus_score: manualData.focus_score,
            environment_score: manualData.environment_score,
            claims_score: manualData.claims_score,
            actions_score: manualData.actions_score,
            net_action_direction: manualData.net_action_direction,
            report_year: manualData.report_year,
            key_findings: [],
            pages_analyzed: 0,
            headquarters: 'Unknown',
            report_type: 'Manual Entry',
            last_updated: new Date().toLocaleDateString()
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Company added successfully.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company data.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>{company ? 'Edit Company' : 'Add New Company'}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Company Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <Input
                  value={manualData.name}
                  onChange={(e) => setManualData({...manualData, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <Input
                  value={manualData.industry}
                  onChange={(e) => setManualData({...manualData, industry: e.target.value})}
                  placeholder="Enter industry"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Year
                </label>
                <Input
                  value={manualData.report_year}
                  onChange={(e) => setManualData({...manualData, report_year: e.target.value})}
                  placeholder="Enter report year"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Net Action Direction
                </label>
                <select
                  value={manualData.net_action_direction}
                  onChange={(e) => setManualData({...manualData, net_action_direction: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Scores (0-100)</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualData.overall_score}
                    onChange={(e) => setManualData({...manualData, overall_score: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Focus Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualData.focus_score}
                    onChange={(e) => setManualData({...manualData, focus_score: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environment Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualData.environment_score}
                    onChange={(e) => setManualData({...manualData, environment_score: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Claims Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualData.claims_score}
                    onChange={(e) => setManualData({...manualData, claims_score: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actions Score
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualData.actions_score}
                    onChange={(e) => setManualData({...manualData, actions_score: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button
                onClick={handleManualSubmit}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? 'Saving...' : (company ? 'Update Company' : 'Add Company')}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>

          {!company && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or import from file</span>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    accept=".tsv,.csv,.txt"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {/* CSV processing logic would go here */}}
                    disabled={!csvFile || isProcessing}
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Process File
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-2">Expected File Format:</p>
                      <div className="bg-white p-2 rounded text-xs font-mono border">
                        <div>Company	Relative Focus Score	Environment Score	Claims Score	Actions Score	Net Action Direction</div>
                        <div>Example_Company	0.7420960927	0.4145169357	29.93834326	25.70173876	Negative</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyzedCompanyUpload;

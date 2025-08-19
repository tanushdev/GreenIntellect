import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Clock, CheckCircle, AlertTriangle, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PdfUpload {
  id: string;
  file_name: string;
  upload_status: 'pending' | 'processing' | 'completed' | 'failed';
  company_name?: string;
  created_at: string;
  analyzed_at?: string;
  analysis_results?: any;
}

const PdfUploadTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<PdfUpload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('pdf_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure upload_status is properly typed
      const typedData = (data || []).map(upload => ({
        ...upload,
        upload_status: upload.upload_status as 'pending' | 'processing' | 'completed' | 'failed'
      }));
      
      setUploads(typedData);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: "Error",
        description: "Failed to load your uploads.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUpload = async (uploadId: string) => {
    try {
      const { error } = await supabase
        .from('pdf_uploads')
        .delete()
        .eq('id', uploadId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setUploads(uploads.filter(upload => upload.id !== uploadId));
      toast({
        title: "Success",
        description: "Upload deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast({
        title: "Error",
        description: "Failed to delete upload.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUploads();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading your uploads...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-base sm:text-xl">My PDF Uploads</span>
          </CardTitle>
          <Button 
            onClick={fetchUploads} 
            variant="outline" 
            size="sm"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {uploads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm sm:text-base">No uploads yet. Upload your first PDF to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(upload.upload_status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {upload.file_name}
                        </h3>
                        {upload.company_name && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Company: {upload.company_name}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500">
                          <span>Uploaded: {format(new Date(upload.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          {upload.analyzed_at && (
                            <span>Analyzed: {format(new Date(upload.analyzed_at), 'MMM dd, yyyy HH:mm')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <Badge className={`${getStatusColor(upload.upload_status)} justify-center sm:justify-start text-xs`}>
                      {upload.upload_status.charAt(0).toUpperCase() + upload.upload_status.slice(1)}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      {upload.upload_status === 'completed' && upload.analysis_results && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Create downloadable analysis report
                            const analysisText = JSON.stringify(upload.analysis_results, null, 2);
                            const blob = new Blob([analysisText], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `analysis-${upload.company_name || upload.file_name}.json`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="text-xs h-7 sm:h-8 px-2 sm:px-3"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUpload(upload.id)}
                        className="text-xs h-7 sm:h-8 px-2 sm:px-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {upload.upload_status === 'failed' && (
                  <div className="mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded text-xs sm:text-sm text-red-700">
                    Upload failed. Please try uploading again.
                  </div>
                )}
                
                {upload.upload_status === 'completed' && upload.analysis_results && (
                  <div className="mt-3 p-2 sm:p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-xs sm:text-sm text-green-700 font-medium mb-2">Analysis Complete</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {Object.entries(upload.analysis_results).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-medium text-green-800">{typeof value === 'number' ? value : 'N/A'}</div>
                          <div className="text-green-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfUploadTracker;

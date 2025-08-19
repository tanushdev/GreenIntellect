
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, FileText, Search, Eye, Trash2, Download, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UploadWithProfile {
  id: string;
  file_name: string;
  file_path?: string;
  upload_status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected' | 'approved';
  company_name?: string;
  created_at: string;
  analyzed_at?: string;
  analysis_results?: any;
  user_id: string;
  user_full_name?: string;
  error_message?: string | null;
}

interface UploadManagementProps {
  uploads: UploadWithProfile[];
  onRefresh: () => void;
}

const PAGE_SIZE = 8;

const UploadManagement: React.FC<UploadManagementProps> = ({ uploads, onRefresh }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<UploadWithProfile | null>(null);
  const [rejectionModal, setRejectionModal] = useState<{open: boolean, id?: string} | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const downloadPdf = async (filePath: string, fileName: string) => {
    setUpdatingId(filePath); // Use filePath as a temporary unique ID for loading state
    try {
      const { data, error } = await supabase.storage.from('pdf-reports').download(filePath);
      if (error) throw error;

      const blob = data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `${fileName} is downloading.`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Failed",
        description: "Could not download the PDF file. It may no longer exist.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // PAGINATION
  const filteredUploads = uploads.filter(upload =>
    upload.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upload.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upload.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUploads.length / PAGE_SIZE);

  const pagedUploads = filteredUploads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // FIXED STATUS HANDLERS - Simplified and direct approach
  const setUploadStatus = async (
    uploadId: string, 
    status: 'approved' | 'processing' | 'completed' | 'rejected', 
    reason?: string
  ) => {
    console.log('=== ADMIN STATUS UPDATE START ===');
    console.log('Upload ID:', uploadId);
    console.log('New Status:', status);
    console.log('Reason:', reason);
    
    setUpdatingId(uploadId);
    
    try {
      // Build update object - simplified approach
      const updateData: any = { 
        upload_status: status,
        updated_at: new Date().toISOString()
      };
      
      // Handle rejection with reason
      if (status === 'rejected' && reason) {
        updateData.error_message = reason;
      } else if (status !== 'rejected') {
        updateData.error_message = null; // Clear error message for non-rejected statuses
      }

      console.log('Update data being sent:', updateData);

      // Direct database update with detailed error logging
      const { data, error } = await supabase
        .from('pdf_uploads')
        .update(updateData)
        .eq('id', uploadId)
        .select('*');

      if (error) {
        console.error('=== DATABASE UPDATE ERROR ===');
        console.error('Error details:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      console.log('=== DATABASE UPDATE SUCCESS ===');
      console.log('Updated record:', data);

      // Show success toast
      const statusText = status === 'rejected' ? `rejected: ${reason}` : status;
      toast({
        title: "Status Updated Successfully",
        description: `Upload ${statusText}.`,
        variant: "default"
      });

      // Force refresh after a short delay to ensure database has updated
      setTimeout(() => {
        console.log('Forcing refresh...');
        onRefresh();
      }, 1000);
      
    } catch (error) {
      console.error('=== UPLOAD STATUS UPDATE ERROR ===');
      console.error('Full error:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update upload status.",
        variant: "destructive"
      });
    } finally {
      setUpdatingId(null);
      // Close rejection modal
      if (rejectionModal) {
        setRejectionModal(null);
        setRejectReason('');
      }
    }
  };

  const deleteUpload = async (uploadId: string) => {
    setUpdatingId(uploadId);
    try {
      const { error } = await supabase
        .from('pdf_uploads')
        .delete()
        .eq('id', uploadId);

      if (error) throw error;

      onRefresh();
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
    setUpdatingId(null);
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
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-base sm:text-xl">PDF Uploads Management</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
              disabled={updatingId !== null}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${updatingId !== null ? 'animate-spin' : ''}`} />
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
              placeholder="Search uploads..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-end mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="px-2 mr-2"
              onClick={() => setCurrentPage(v => Math.max(1, v-1))}
              disabled={currentPage <= 1}
            >
              <ArrowUp className="w-3 h-3" /> Prev
            </Button>
            <span className="text-xs text-gray-700 mx-1">{currentPage} / {totalPages}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-2 ml-2"
              onClick={() => setCurrentPage(v => Math.min(totalPages, v+1))}
              disabled={currentPage >= totalPages}
            >
              Next <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
        )}

        {/* Uploads List */}
        {pagedUploads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm sm:text-base">
              {uploads.length === 0 ? 'No uploads yet.' : 'No uploads match your search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pagedUploads.map((upload) => (
              <div
                key={upload.id}
                className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {upload.file_name}
                        </h3>
                        <div className="flex flex-col space-y-1 mt-1 text-xs sm:text-sm text-gray-600">
                          {upload.company_name && (
                            <span>Company: {upload.company_name}</span>
                          )}
                          <span>User: {upload.user_full_name || upload.user_id}</span>
                          <span>Uploaded: {format(new Date(upload.created_at), 'MMM dd, yyyy HH:mm')}</span>
                          {upload.analyzed_at && (
                            <span>Analyzed: {format(new Date(upload.analyzed_at), 'MMM dd, yyyy HH:mm')}</span>
                          )}
                        </div>
                        {/* Show Rejected Reason */}
                        {upload.upload_status === 'rejected' && upload.error_message && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            <strong>Rejection reason:</strong> {upload.error_message}
                          </div>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(upload.upload_status)} mt-2 sm:mt-0 sm:ml-3 self-start text-xs`}>
                        {upload.upload_status.charAt(0).toUpperCase() + upload.upload_status.slice(1)}
                      </Badge>
                    </div>
                    
                    {upload.upload_status === 'completed' && upload.analysis_results && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-green-50 p-2 sm:p-3 rounded">
                        {Object.entries(upload.analysis_results).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-medium text-green-800">{typeof value === 'number' ? value : 'N/A'}</div>
                            <div className="text-green-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* CONTROL BUTTONS */}
                  <div className="flex flex-col sm:flex-row flex-wrap space-y-2 sm:space-y-0 sm:space-x-2 lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUpload(upload)}
                      className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>

                    {upload.file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPdf(upload.file_path!, upload.file_name)}
                        disabled={updatingId === upload.file_path}
                        className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3"
                      >
                        {updatingId === upload.file_path ? (
                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Download className="w-3 h-3 mr-1" />
                        )}
                        <span className="hidden sm:inline">Download</span>
                      </Button>
                    )}
                    
                    {upload.upload_status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUploadStatus(upload.id, 'approved')}
                          disabled={updatingId === upload.id}
                          className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3 text-green-700"
                        >
                          {updatingId === upload.id ? (
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          {updatingId === upload.id ? 'Updating...' : 'Approve'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRejectionModal({ open: true, id: upload.id })}
                          disabled={updatingId === upload.id}
                          className="w-full sm:w-auto text-xs h-7 sm:h-8 px-2 sm:px-3 text-red-600"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUpload(upload.id)}
                      disabled={updatingId === upload.id}
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
        )}

        {/* Upload Details Modal */}
        {selectedUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Upload Details</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedUpload(null)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">File Name</label>
                    <p className="text-sm mt-1">{selectedUpload.file_name}</p>
                  </div>
                  
                  {selectedUpload.company_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company</label>
                      <p className="text-sm mt-1">{selectedUpload.company_name}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge className={`${getStatusColor(selectedUpload.upload_status)} mt-1`}>
                      {selectedUpload.upload_status.charAt(0).toUpperCase() + selectedUpload.upload_status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">User</label>
                    <p className="text-sm mt-1">{selectedUpload.user_full_name || selectedUpload.user_id}</p>
                  </div>

                  {selectedUpload.upload_status === 'rejected' && selectedUpload.error_message && (
                    <div>
                      <label className="text-sm font-medium text-red-600">Rejection Reason</label>
                      <p className="text-sm mt-1 text-red-700">{selectedUpload.error_message}</p>
                    </div>
                  )}
                  
                  {selectedUpload.analysis_results && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Analysis Results</label>
                      <pre className="text-xs mt-1 bg-gray-50 p-3 rounded overflow-auto max-h-40">
                        {JSON.stringify(selectedUpload.analysis_results, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIMPLIFIED Reject Reason Modal */}
        {rejectionModal?.open && rejectionModal.id && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-red-700 flex items-center">
                  <X className="w-4 h-4 mr-1" /> Reject Upload
                </h3>
                <p className="text-xs text-gray-500 mt-2">Please provide a reason for rejection:</p>
                <Input 
                  className="mt-2" 
                  placeholder="Enter rejection reason..." 
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  disabled={updatingId !== null}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => { setRejectionModal(null); setRejectReason(''); }}
                  disabled={updatingId !== null}
                >Cancel</Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => setUploadStatus(rejectionModal.id!, 'rejected', rejectReason)}
                  disabled={rejectReason.trim() === '' || updatingId !== null}
                >
                  {updatingId === rejectionModal.id ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    'Reject'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadManagement;
